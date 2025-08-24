/**
 * Generates a random integer between 0 and a specific number, inclusively.
 *
 * @param max the maximum number that can be generated
 * @return the randomly generated integer
 */
export function int(max: number): number;

/**
 * Generates a random integer between a specified minimum and maximum number, inclusively.
 *
 * @param min the minimum number that can be generated
 * @param max the maximum number that can be generated
 * @return the randomly generated integer
 */
export function int(min: number, max: number): number;

export function int(minOrMax: number, max?: number) {
	const rand = new Random();

	const _min = max === undefined ? 0 : minOrMax;
	const _max = max === undefined ? minOrMax : max;
	return rand.NextInteger(_min, _max);
}

/**
 * Generates a random number between 0 and 1.
 *
 * @return the randomly generated number
 */
export function num(): number;

/**
 * Generates a random number between 0 and a specified number, inclusively.
 *
 * @param max the maximum number that can be generated
 * @return the randomly generated number
 */
export function num(max: number): number;

/**
 * Generates a random number between a specified minimum and maximum number, inclusively.
 *
 * @param min the minimum number that can be generated
 * @param max the maximum number that can be generated
 * @return the randomly generated number
 */
export function num(min: number, max: number): number;

export function num(minOrMax?: number, max?: number) {
	const rand = new Random();

	if (minOrMax === undefined) {
		return rand.NextNumber();
	}

	const _min = max === undefined ? 0 : minOrMax;
	const _max = max === undefined ? minOrMax : max;

	return rand.NextNumber(_min, _max);
}
