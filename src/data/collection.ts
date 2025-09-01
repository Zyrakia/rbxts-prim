import { t } from '@rbxts/t';
import * as Arr from './array';

type Collection<T = unknown> = Set<T> | Map<unknown, T> | Array<T> | Record<string, T>;

/**
 * Checks whether a collection is a map (KV object with any key).
 *
 * @param collection the value to check
 * @return `true` if the value is a map, `false` otherwise
 */
function isMap(collection: unknown): collection is Map<unknown, unknown> {
	return t.map(t.any, t.any)(collection);
}

/**
 * Checks whether a collection is a record (KV object with only string keys).
 *
 * @param collection the value to check
 * @return `true` if the value is a record, `false` otherwise
 */
function isRecord(collection: unknown): collection is Record<string, unknown> {
	return t.map(t.string, t.any)(collection);
}

/**
 * Iterates over every entry within a set.
 *
 * @param collection the set to iterate over
 * @param callback the callback to invoke for each entry
 */
export function iterate<V>(collection: Set<V>, callback: (key: true, value: V) => void): void;

/**
 * Iterates over every entry within a map.
 *
 * @param collection the map to iterate over
 * @param callback the callback to invoke for each entry
 */
export function iterate<K, V>(collection: Map<K, V>, callback: (key: K, value: V) => void): void;

/**
 * Iterates over every entry within an array.
 *
 * @param collection the array to iterate over
 * @param callback the callback to invoke for each entry
 */
export function iterate<V>(collection: Array<V>, callback: (key: number, value: V) => void): void;

/**
 * Iterates over every entry within a record.
 *
 * @param collection the record to iterate over
 * @param callback the callback to invoke for each entry
 */
export function iterate<K extends string, V>(
	collection: Record<K, V> | Map<K, V>,
	callback: (key: K, value: V) => void,
): void;

/**
 * Iterates over every entry with a collection.
 *
 * @param collection the collection to iterate over
 * @param callback the callback to invoke for each entry
 */
export function iterate<T>(collection: Collection<T>, callback: (key: unknown, value: T) => void): void;

export function iterate(collection: Collection, callback: (key: any, value: any) => void) {
	if (isMap(collection)) {
		for (const [key, value] of collection) {
			callback(key, value);
		}
	} else if (isRecord(collection)) {
		for (const [key, value] of pairs(collection)) {
			callback(key, value);
		}
	} else if (Arr.is(collection)) {
		for (const [i, value] of ipairs(collection)) {
			callback(i, value);
		}
	} else {
		for (const value of collection) {
			callback(true, value);
		}
	}
}

/**
 * Returns a generator that yields entries within
 * a set until depleted.
 *
 * @param collection the set to iterate over
 */
export function iterator<V>(collection: Set<V>): Generator<[key: true, value: V]>;

/**
 * Returns a generator that yields entries within
 * a map until depleted.
 *
 * @param collection the map to iterate over
 */
export function iterator<K, V>(collection: Map<K, V>): Generator<[key: K, value: V]>;

/**
 * Returns a generator that yields entries within
 * a array until depleted.
 *
 * @param collection the array to iterate over
 */
export function iterator<V>(collection: Array<V>): Generator<[key: number, value: V]>;

/**
 * Returns a generator that yields entries within
 * a record until depleted.
 *
 * @param collection the record to iterate over
 */
export function iterator<K extends string, V>(
	collection: Record<K, V> | Map<K, V>,
): Generator<[key: K, value: V]>;

/**
 * Returns a generator that yields entries within
 * a collection until depleted.
 *
 * @param collection the collection to iterate over
 */
export function iterator<V>(collection: Collection<V>): Generator<[key: unknown, value: V]>;

export function* iterator(collection: Collection) {
	if (isMap(collection)) {
		for (const entry of collection) {
			yield entry;
		}
	} else if (isRecord(collection)) {
		for (const entry of pairs(collection)) {
			yield entry;
		}
	} else if (Arr.is(collection)) {
		for (const [i, value] of ipairs(collection)) {
			yield [i, value];
		}
	} else {
		for (const value of collection) {
			yield [true, value];
		}
	}
}

/**
 * Gathers results by mapping every entry within a set.
 *
 * @param collection the set to map over
 * @param mapper the function to return the result for each value
 * @return the array of values gathered
 */
export function map<V, R>(collection: Set<V>, callback: (key: true, value: V) => R): Array<R>;

/**
 * Gathers results by mapping every entry within a map.
 *
 * @param collection the map to map over
 * @param mapper the function to return the result for each value
 * @return the array of values gathered
 */
export function map<K, V, R>(collection: Map<K, V>, callback: (key: K, value: V) => R): Array<R>;

/**
 * Gathers results by mapping every entry within an array.
 *
 * @param collection the array to map over
 * @param mapper the function to return the result for each value
 * @return the array of values gathered
 */
export function map<V, R>(collection: Array<V>, callback: (key: number, value: V) => R): Array<R>;

/**
 * **Internal generic overload**
 *
 * Gathers results by mapping every entry within an collection.
 *
 * @param collection the collection to map over
 * @param mapper the function to return the result for each value
 * @return the array of values gathered
 */
export function map<T, R>(collection: Collection<T>, callback: (key: unknown, value: T) => R): Array<R>;

/**
 * Gathers results by mapping every entry within a record.
 *
 * @param collection the record to map over
 * @param mapper the function to return the result for each value
 * @return the array of values gathered
 */
export function map<K extends string, V, R>(
	collection: Record<K, V> | Map<K, V>,
	callback: (key: K, value: V) => R,
): Array<R>;

export function map(collection: Collection, callback: (key: any, value: any) => defined) {
	const results: Array<defined> = [];

	iterate(collection, (key, value) => {
		results.push(callback(key, value));
	});

	return results;
}

/**
 * Runs every entry in the collection.
 *
 * @param collection the collection
 * @param args the arguments to pass to each entry invocation
 */
export function run<T extends Callback>(collection: Collection<T>, ...args: Parameters<T>) {
	const run = (v: Callback) => void v(...(args as unknown[]));
	iterate(collection, (_, v) => run(v));
}

/**
 * Asynchronously runs every entry in the collection.
 *
 * @param collection the collection
 * @param args the arguments to pass to each entry invocation
 * @return a promise that resolves when all invocations finish
 */
export async function runAsync<T extends Callback>(collection: Collection<T>, ...args: Parameters<T>) {
	const run = async (v: T) => void (await v(...(args as unknown[])));
	await Promise.all(map(collection, (_, v) => run(v)));
}

/**
 * Extracts all values from a collection and gathers them into an array.
 *
 * @param collection the collection to convert
 * @returns an array containing all values
 */
export function toValueArray<T extends defined>(collection: Collection<T>) {
	return map(collection, (_, v) => v);
}

/**
 * Extracts all entries from a record and gathers them into an array.
 *
 * @param collection the record to convert
 * @returns an array containing all entries
 */
export function toEntryArray<K extends string, V>(
	collection: Record<K, V> | Map<K, V>,
): Array<[key: K, value: V]>;

/**
 * Extracts all entries from a set and gathers them into an array.
 *
 * @param collection the set to convert
 * @returns an array containing all entries
 */
export function toEntryArray<V>(collection: Set<V>): Array<[key: true, value: V]>;

/**
 * Extracts all entries from a map and gathers them into an array.
 *
 * @param collection the map to convert
 * @returns an array containing all entries
 */
export function toEntryArray<K, V>(collection: Map<K, V>): Array<[key: K, value: V]>;

/**
 * Extracts all entries from an array and gathers them into a new array.
 *
 * @param collection the array to convert
 * @returns an array containing all entries
 */
export function toEntryArray<V>(collection: Array<V>): Array<[key: number, value: V]>;

export function toEntryArray(collection: Collection) {
	return map(collection, (k, v) => [k, v]);
}

/**
 * Extracts all keys from an array and gathers them into an array.
 *
 * @param collection the array to convert
 * @return an array containing all keys
 */
export function toKeyArray(collection: Array<unknown>): Array<number>;

/**
 * Extracts all keys from a set and gathers them into an array.
 *
 * @param collection the set to convert
 * @return an array containing all keys
 */
export function toKeyArray(collection: Set<unknown>): Array<true>;

/**
 * Extracts all keys from a map and gathers them into an array.
 *
 * @param collection the map to convert
 * @return an array containing all keys
 */
export function toKeyArray<K>(collection: Map<K, unknown>): Array<K>;

/**
 * Extracts all keys from a record and gathers them into an array.
 *
 * @param collection the record to convert
 * @return an array containing all keys
 */
export function toKeyArray<K extends string>(collection: Record<K, unknown> | Map<K, unknown>): Array<K>;

export function toKeyArray(collection: Collection) {
	return map(collection, (k, _) => k);
}
