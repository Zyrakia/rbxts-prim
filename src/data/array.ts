type ArrayOrConstant<T> = T | T[];

/**
 * Determines whether any specified value is a lua sequential array object.
 *
 * @param value the value to check
 * @return whether the value is an array
 */
export function is(value: unknown): value is Array<unknown> {
	if (typeOf(value) !== 'table') return false;

	let count = 0;
	for (const _ of ipairs(value as unknown[])) {
		count += 1;
	}

	return count === (value as Array<unknown>).size();
}

/**
 * Ensures a specified value is an array.
 * If it is not already, it will be packed into a new array.
 *
 * @param value the value to ensure
 * @return the value as an array
 */
export function ensure<T>(value: ArrayOrConstant<T>) {
	return is(value) ? value : [value];
}

/**
 * Creates a new array representing all elements of a specified array in reverse order.
 *
 * @param array the array to reverse
 * @return a copy of the array with elements reversed
 */
export function reverse<T extends defined[]>(array: T) {
	const reversed = [...array];

	const len = reversed.size();
	for (let i = 0; i < len / 2; i++) {
		const j = reversed.size() - i - 1;
		const temp = reversed[i];
		reversed[i] = reversed[j];
		reversed[j] = temp;
	}

	return reversed;
}

/**
 * Composes a specific length array with elements provided by the specified generator function.
 *
 * @param len the length of the created array
 * @param generator the generator used to populate every index
 * @return the array filled with the generated elements
 */
export function compose<T extends defined>(len: number, generator: (i: number) => T) {
	const arr = [];
	for (const i of $range(0, len - 1)) arr[i] = generator(i);
	return arr;
}

/**
 * Shuffles the elements within a specified array to be in random order.
 *
 * @param array the array to shuffle
 * @param random the random instance to shuffle with
 * @return a copy of the array with elements shuffled
 */
export function shuffle<T>(array: Array<T>, random = new Random()) {
	const shuffled = [...array];

	const size = array.size();
	for (let i = 0; i < size - 1; i++) {
		const swap = random.NextInteger(i, size - 1);

		let temp = shuffled[i];
		shuffled[i] = shuffled[swap];
		shuffled[swap] = temp;
	}

	return shuffled;
}

/**
 * Checks if both arrays are the same size and contain the same elements.
 *
 * @param first the first array to compare
 * @param second the second array to compare
 * @returns whether the arrays are equal
 */
export function equals<T extends defined>(first: ReadonlyArray<T>, second: ReadonlyArray<T>) {
	if (first.size() !== second.size()) return false;

	for (let i = 0; i < first.size(); i++) {
		if (first[i] !== second[i]) return false;
	}

	return true;
}

/**
 * Returns a copy of the input array sliced down to the specified indices.
 * The input array is NOT modified.
 *
 * @param array the array to slice
 * @param start the index to start at
 * @param stop the index to stop at
 * @returns the specified slice of the input array
 */
export function slice<T>(array: T[], start: number, stop?: number) {
	const size = array.size();

	const startI = math.min(start, size);
	const endI = stop === undefined ? size : math.min(stop + 1, size);

	const result = [];
	for (let i = startI; i < endI; i++) result.push(array[i]);
	return result;
}

/**
 * Pushes a value at every `n` index of an array.
 *
 * @param arr the input array
 * @param value the value to push
 * @param n the number of indexes before every insert
 * @returns a copy of the input array with values inserted
 */
export function putEvery<T>(arr: ReadonlyArray<T>, n: number, value: T) {
	const newArray = [];

	for (let i = 0; i < arr.size(); i++) {
		if (i === 0 ? n === 0 : i % n === 0) newArray.push(value);
		newArray.push(arr[i]);
	}

	return newArray;
}
