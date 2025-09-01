import { Players } from '@rbxts/services';

/**
 * Represents a map that generates a
 * default value for unseen keys.
 */
export class DefaultMap<K, V> {
	private readonly map: Map<K, V>;

	/**
	 * Creates a new default map.
	 *
	 * @param generator the default value generator for new keys
	 */
	public constructor(
		private readonly generator: (key: K) => V,
		...initEntries: ReadonlyArray<readonly [K, V]>
	) {
		this.map = new Map(initEntries);
	}

	/**
	 * Retrieves or generates a value from this map
	 * based on a key.
	 *
	 * If a value is not stored under the key, it is
	 * generated, stored and returned.
	 *
	 * @param key the key to retrieve the value for
	 * @return the stored or generated value
	 */
	public get(key: K) {
		const existing = this.map.get(key);
		if (existing !== undefined) return existing;

		const generated = this.generator(key);
		this.map.set(key, generated);
		return generated;
	}

	/**
	 * Sets the value associated with a key.
	 *
	 * @param key the key for the value
	 * @param value the value to store
	 */
	public set(key: K, value: V) {
		this.map.set(key, value);
		return this;
	}

	/**
	 * Returns whether this map has a value stored for a key.
	 */
	public has(key: K) {
		return this.map.has(key);
	}

	/**
	 * Deletes the value associated with a key.
	 *
	 * @param key the key to delete
	 * @return whether the key was removed, `false` if the key was never set
	 */
	public delete(key: K) {
		return this.map.delete(key);
	}

	/**
	 * Clears all entries from this map.
	 */
	public clear() {
		this.map.clear();
		return this;
	}

	/**
	 * Returns the current amount of entries in this map.
	 */
	public size() {
		return this.map.size();
	}

	/**
	 * Returns whether this map is currently empty.
	 */
	public isEmpty() {
		return this.map.isEmpty();
	}

	/**
	 * Invokes a callback function for each element in this map.
	 *
	 * @param callbackfn the function that is called for each element
	 */
	public forEach(callbackfn: (value: V, key: K, self: ReadonlyMap<K, V>) => void) {
		this.map.forEach(callbackfn);
	}
}
