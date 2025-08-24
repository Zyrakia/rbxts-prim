/**
 * Selects and returns a value from an array.
 *
 * If the array is empty, this will return undefined, but
 * the return type does not indicate that.
 *
 * @param arr the array to choose from
 * @param rand the random instance to use
 * @return the random element
 */
export function arr<T>(arr: Array<T>, rand = new Random()) {
	return arr[rand.NextInteger(0, arr.size() - 1)];
}

/**
 * Selects and returns a random value from a map.
 *
 * If the map is empty, this will return undefined, but
 * the return type does not indicate that.
 *
 * @param map the map to choose from
 * @param rand the random instance to use
 * @return the random element
 */
export function map<K, V>(map: Map<K, V>, rand = new Random()) {
	let i = rand.NextNumber(0, map.size() - 1);
	for (const [key, value] of map) if (i-- <= 0) return $tuple(key, value);
}

/**
 * Selects and returns a random value from a set.
 *
 * If the set is empty, this will return undefined, but
 * the return type does not indicate that.
 *
 * @param set the set to choose from
 * @param rand the random instance to use
 * @return the random element
 */
export function set<V>(set: Set<V>, rand = new Random()) {
	let i = rand.NextNumber(0, set.size() - 1);
	for (const value of set) if (i-- <= 0) return value;
}
