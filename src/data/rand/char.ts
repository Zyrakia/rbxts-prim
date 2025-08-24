import { Rand } from 'data';

/**
 * Returns a random lowercase alphabetical letter (a-z).
 *
 * @param rand the random instance to use
 * @returns a random letter
 */
export function lowerAlpha(rand = new Random()) {
	return string.char(rand.NextInteger(97, 122));
}

/**
 * Returns a random uppercase alphabetical letter (A-Z).
 *
 * @param rand the random instance to use
 * @returns a random letter
 */
export function upperAlpha(rand = new Random()) {
	return string.char(rand.NextInteger(65, 90));
}

/**
 * Returns a random basic ascii character (Aa-Zz 0-9 {}|~`_^[]\/@?<>=;:.-,+*()'&%$#"!).
 * Excludes invisible and control characters (space, delete, \n, ...)
 *
 * @param rand the random instance to use
 * @returns a random letter
 */
export function ascii(rand = new Random()) {
	return string.char(rand.NextInteger(33, 126));
}

/**
 * Returns a string consisting of random basic ascii characters.
 *
 * @param len the length of the resulting string, default 25
 * @param rand the random instance to use
 * @return the resulting random string
 */
export function str(len = 25, rand = new Random()) {
	let s = '';
	for (let i = 0; i < len; i++) s += ascii(rand);
	return s;
}
