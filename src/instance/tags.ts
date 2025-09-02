import { CollectionService } from '@rbxts/services';
import { t } from '@rbxts/t';

/**
 * Applies a tag to specified instances.
 *
 * @param tag the tag to apply
 * @param instances the instances to apply the tag to
 */
export function add(tag: string, ...instances: Instance[]) {
	for (const inst of instances) CollectionService.AddTag(inst, tag);
}

/**
 * Removes a tag from specified instances.
 *
 * @param tag the tag to remove
 * @param instances the instances to remove the tag from
 */
export function remove(tag: string, ...instances: Instance[]) {
	for (const inst of instances) CollectionService.RemoveTag(inst, tag);
}

/**
 * Returns whether all specified instances have a tag applied.
 */
export function has(tag: string, ...instances: Instance[]) {
	return instances.every((v) => CollectionService.HasTag(v, tag));
}

/**
 * Returns all instances that have a tag applied.
 */
export function get(tag: string): Instance[];

/**
 * Returns all tags that an instance has applied.
 */
export function get(inst: Instance): string[];

export function get(target: string | Instance) {
	if (typeIs(target, 'string')) return CollectionService.GetTagged(target);
	return CollectionService.GetTags(target);
}

/**
 * Removes a tag from all instances that currently have it applied.
 *
 * @param tag the tag to clear
 * @return the instances that had the tag removed
 */
export function clear(tag: string): Instance[];

/**
 * Removes all applied tags from an instance.
 *
 * @param inst the instance to clear tags from
 * @return all tags that were removed from the instance
 */
export function clear(inst: Instance): string[];

export function clear(target: string | Instance) {
	if (typeIs(target, 'string')) {
		const instances = CollectionService.GetTagged(target);
		for (const inst of instances) CollectionService.RemoveTag(inst, target);
		return instances;
	}

	const tags = CollectionService.GetTags(target);
	for (const tag of tags) CollectionService.RemoveTag(target, tag);
	return tags;
}

/**
 * Connects listeners to a tag.
 *
 * Every instance that has the tag to begin with
 * is also processed.
 *
 * @param tag the tag to watch
 * @param listeners the listeners to connect
 * @param guard an optional guard that an instance has to pass to be processed
 * @return a callback that disconnects all connections made
 */
export function watch<T extends Instance = Instance>(
	tag: string,
	listeners: {
		onAdded?: (inst: T, tag: string) => void;
		onRemoved?: (inst: T, tag: string) => void;
	},
	guard?: t.check<T>,
) {
	const { onAdded, onRemoved } = listeners;
	const connections: RBXScriptConnection[] = [];

	const guarded = (v: Instance, cb: (v: T) => void) => {
		if (!guard) cb(v as T);
		else if (guard(v)) cb(v);
	};

	const added = (v: Instance) => guarded(v, (v) => listeners.onAdded?.(v, tag));
	const removed = (v: Instance) => guarded(v, (v) => listeners.onRemoved?.(v, tag));

	if (onAdded) {
		const conn = CollectionService.GetInstanceAddedSignal(tag).Connect(added);
		connections.push(conn);
	}

	if (onRemoved) {
		const conn = CollectionService.GetInstanceRemovedSignal(tag).Connect(removed);
		connections.push(conn);
	}

	for (const initInstance of get(tag)) added(initInstance);

	return () => {
		for (const connection of connections) connection.Disconnect();
		connections.clear();
	};
}

/**
 * Creates a set that is synced with all instances that have a certain tag applied.
 *
 * @param tag the tag to sync the set to
 * @param guard an optional guard that an instance has to pass to be entered into the set
 * @return a tuple containin the set and a callback to disconnect listeners and clear the set
 */
export function watchSet<T extends Instance = Instance>(tag: string, guard?: t.check<T>) {
	const set = new Set<T>();

	const cleanup = watch(
		tag,
		{ onAdded: (inst) => set.add(inst), onRemoved: (inst) => set.delete(inst) },
		guard,
	);

	return $tuple(set, () => {
		set.clear();
		cleanup();
	});
}
