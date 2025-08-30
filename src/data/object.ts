type Key = string | number;
type Plain = Record<Key, unknown>;
type Simplify<T> = { [K in keyof T]: T[K] } & {};

type Assign<A, B> = Simplify<Omit<A, Extract<keyof A, keyof B>> & B>;
type MergeRight<T extends object[], Acc extends object = {}> = T extends [infer H, ...infer R]
	? MergeRight<R extends object[] ? R : [], Assign<Acc, H & object>>
	: Simplify<Acc>;
/**
 * Merges multiple objects together, with right objects overriding
 * duplicate keys in left objects.
 *
 * This merge is only top-level, no deep merging occurs.
 *
 * @param objects a series of plain objects
 * @return the marged object
 */
export function assign<T extends Plain[]>(...objects: T) {
	let running = {};
	for (const t of objects) running = { ...running, ...t };
	return running as MergeRight<T>;
}
