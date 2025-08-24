import { t } from '@rbxts/t';
import { Arr } from 'data';

type Collection<T> = Set<T> | Map<unknown, T> | Array<T> | Record<string, T>;

/**
 * Checks whether a collection is a map (KV object with any key).
 *
 * @param collection the value to check
 * @return `true` if the value is a map, `false` otherwise
 */
function isMap<T>(collection: Collection<T>): collection is Map<unknown, T> {
	return t.map(t.any, t.any)(collection);
}

/**
 * Checks whether a collection is a record (KV object with only string keys).
 *
 * @param collection the value to check
 * @return `true` if the value is a record, `false` otherwise
 */
function isRecord<T>(collection: Collection<T>): collection is Record<string, T> {
	return t.map(t.string, t.any)(collection);
}

/**
 * Iterates over every value within a collection.
 *
 * @param collection the value to iterate over
 * @param callback the callback to invoke for each value
 */
export function iterate<T>(collection: Collection<T>, callback: (value: T) => void) {
	if (isMap(collection)) {
		for (const [, value] of collection) {
			callback(value);
		}
	} else if (isRecord(collection)) {
		for (const [, value] of pairs(collection)) {
			callback(value);
		}
	} else if (Arr.is(collection)) {
		for (const value of collection) {
			callback(value);
		}
	} else {
		for (const value of collection) {
			callback(value);
		}
	}
}

/**
 * Gathers results by mapping every value within a collection.
 *
 * @param collection the value to map over
 * @param mapper the function to return the result for each value
 * @return the array of values gathered
 */
export function map<T, R extends defined>(collection: Collection<T>, mapper: (value: T) => R) {
	const results: R[] = [];
	iterate(collection, (v) => results.push(mapper(v)));
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
	iterate(collection, run);
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
	await Promise.all(map(collection, run));
}

/**
 * Converts any collection into an array.
 *
 * @param collection the collection to convert
 * @returns an array containing all values from the collection
 */
export function toArray<T extends defined>(collection: Collection<T>) {
	return map(collection, (v) => v);
}
