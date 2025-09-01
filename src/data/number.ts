import * as Arr from './array';

/**
 * Returns whether the given number is an integer.
 */
export function isInteger(num: number) {
	return num % 1 === 0;
}

/**
 * Returns whether the given number is even.
 */
export function isEven(num: number) {
	return num % 2 === 0;
}

/**
 * Maps a value from one range to another.
 *
 * @param num the value to map
 * @param from the range to map from
 * @param to the range to map to
 * @returns the mapped value
 */
export function map(num: number, from: [number, number], to: [number, number]) {
	return ((num - from[0]) * (to[1] - to[0])) / (from[1] - from[0]) + to[0];
}

/**
 * Unmaps a value mapped with {@link map}.
 *
 * @param num the value to unmap
 * @param from the from range used to map
 * @param to the to range used to map
 * @returns the unmapped value
 */
export function unmap(num: number, from: [number, number], to: [number, number]) {
	return ((num - to[0]) * (from[1] - from[0])) / (to[1] - to[0]) + from[0];
}

/**
 * Returns a number formatted by separating
 * the thousands with commas.
 *
 * @param num the number to format
 * @returns the formatted number
 */
export function format(num: number) {
	const [number, fraction] = tostring(num).gsub('-', '')[0].split('.');

	return (
		(num < 0 ? '-' : '') +
		Arr.putEvery(number.reverse().split(''), 3, ',').join('').reverse() +
		(fraction ? '.' + fraction : '')
	);
}

/**
 * Rounds num up to the nearest multiple of n.
 *
 * @param num the number to round up
 * @param n the multiple to round up to
 * @returns the rounded number
 */
export function roundUpMultiple(num: number, n: number) {
	if (num % n === 0) return num;

	const remainder = num % n;
	return num - remainder + n;
}

/**
 * Rounds num down to the nearest multiple of n.
 *
 * @param num the number to round down
 * @param n the multiple to round down to
 * @returns the rounded number
 */
export function roundDownMultiple(num: number, n: number) {
	if (num % n === 0) return num;

	const remainder = num % n;
	return num - remainder;
}

/**
 * Returns the given number truncated to the number of decimal places.
 *
 * @param num the number to truncate
 * @param decimals the number of decimal places to truncate to
 * @returns the truncated number
 */
export function truncate(num: number, decimals: number) {
	const multiplier = math.pow(10, decimals);
	return math.floor(num * multiplier) / multiplier;
}
