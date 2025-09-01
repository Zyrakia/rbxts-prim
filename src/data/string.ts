import * as Arr from './array';

/**
 * Removes whitespace from the beginning and end of a string.
 * Graciously stolen from https://github.com/roblox-ts/string-utils
 *
 * @param str the string to trim
 * @returns the trimmed string
 */
export function trim(str: string) {
	const [from] = string.match(str, '^%s*()') as LuaTuple<[number]>;
	const [trimmed] = (from > str.size() && '') || string.match(str, '.*%S', from);
	return trimmed === undefined ? '' : tostring(trimmed);
}

/**
 * Removes whitespace from the start of a string.
 * Graciously stolen from https://github.com/roblox-ts/string-utils
 *
 * @param str the string to trim
 * @returns the trimmed string
 */
export function trimStart(str: string) {
	const [from] = string.match(str, '^%s*()') as LuaTuple<[number]>;
	return (from > str.size() && '') || string.sub(str, from);
}

/**
 * Removes whitespace from the end of a string.
 * Graciously stolen from https://github.com/roblox-ts/string-utils
 *
 * @param str the string to trim
 * @returns the trimmed string
 */
export function trimEnd(str: string) {
	const [from] = string.match(str, '^%s*') as LuaTuple<[number]>;
	return (from === str.size() && '') || string.match(str, '.*%S')[0];
}

/**
 * Checks if a string starts with a given substring.
 *
 * @param str the string to check
 * @param search the substring to check for
 * @returns whether the string starts with the substring
 */
export function startsWith(str: string, search: string) {
	return string.sub(str, 0, search.size()) === search;
}

/**
 * Checks if the string ends with the given search string.
 *
 * @param str the string to check
 * @param search the search string
 * @returns whether the string ends with the search string
 */
export function endsWith(str: string, search: string) {
	return string.sub(str, -search.size()) === search;
}

/**
 * Returns a slice of the string.
 *
 * @param str the string to slice
 * @param from the start index (1-based)
 * @param to the end index (1-based, default is the end of the string)
 * @returns the sliced portion of the string
 */
export function slice(str: string, from: number, to?: number) {
	return string.sub(str, from, to);
}

/**
 * Checks if the string contains the given substring.
 *
 * @param str the string to check
 * @param sub the substring to check for
 * @param from the start index (1-based), default 1
 * @returns whether the string contains the substring.
 */
export function includes(str: string, search: string, from = 1) {
	return string.find(str, search, from, true)[0] !== undefined;
}

/**
 * Returns all numbers in the specified string.
 *
 * @param str the string to get the numbers from
 * @returns a string containing only the numbers from the input string
 */
export function extractNumbers(str: string) {
	let result = '';
	for (const match of str.gmatch('%d+')) result += match;
	return result;
}

/**
 * Truncates a string to the specified length, then adds a suffix.
 *
 * @param str the string to truncate
 * @param length the length to truncate to
 * @param suffix the suffix to add, default `'...'`
 * @returns the truncated string
 */
export function truncate(str: string, length: number, suffix = '...') {
	return str.size() > length ? str.sub(0, length) + suffix : str;
}

type PluralizeRule = { rep: string; with: string };

/**
 * Pluralized a word depending on the associated count.
 *
 * If the ending is not a constant, and none of the rules match,
 * the fallback ending will be the constant `'s'`.
 *
 * @param word the word to pluralize
 * @param count the count associated to the word
 * @param ending the pluralized ending, either a constant or replacement rule(s), default `'s'`
 * @return the pluralized word, or the original word if `count` is `1`
 */
export function pluralize(
	word: string,
	count: number,
	ending: string | PluralizeRule | PluralizeRule[] = 's',
) {
	if (math.abs(count) === 1) return word;
	if (typeIs(ending, 'string')) return word + ending;

	for (const rule of Arr.ensure(ending)) {
		const { rep: search, with: replacement } = rule;

		if (endsWith(word, search)) {
			return slice(word, 1, word.size() - search.size()) + replacement;
		}
	}

	return word + 's';
}

/**
 * Pads the end of the passed string with the specified
 * character until the string reaches the specified length.
 *
 * @param str the string to pad
 * @param length the length to pad to
 * @param char the character to pad with, default `' '`
 * @returns the padded string
 */
export function padEnd(str: string, length: number, char = ' ') {
	return str.size() >= length ? str : str + char.rep(length - str.size());
}

/**
 * Pads the beginning of the passed string with the specified
 * character until the string reaches the specified length.
 *
 * @param str the string to pad
 * @param length the length to pad to
 * @param char the character to pad with, default `' '`
 * @returns the padded string
 */
export function padStart<T extends string>(str: T, length: number, char = ' ') {
	return str.size() >= length ? str : char.rep(length - str.size()) + str;
}

/**
 * Returns the input string with the first character capitalized.
 *
 * @param str the string to capitalize.
 * @returns the capitalized string.
 */
export function capitalize<T extends string>(str: T) {
	return (slice(str, 0, 1).upper() + slice(str, 2)) as Capitalize<T>;
}

/**
 * Returns the input string with the fist character lowercased.
 *
 * @param str the string to lowercase
 * @returns the lowercased string
 */
export function uncapitalize<T extends string>(str: T) {
	return (slice(str, 0, 1).lower() + slice(str, 2)) as Uncapitalize<T>;
}
