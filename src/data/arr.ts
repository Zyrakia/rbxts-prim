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
