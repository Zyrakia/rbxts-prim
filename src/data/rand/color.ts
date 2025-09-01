import * as Color from '../color';

/**
 * Returns a random RGB color.
 *
 * Randomly generates a value between 0 and 255 for
 * R, G, B, and then constructs the values into a color.
 *
 * @param rand the random instance to use
 * @return the generated colour
 */
export function rgb(rand = new Random()) {
	const RGB_MIN = 0;
	const RGB_MAX = 255;

	const gen = () => rand.NextInteger(RGB_MIN, RGB_MAX);
	return Color.rgb(gen(), gen(), gen());
}
