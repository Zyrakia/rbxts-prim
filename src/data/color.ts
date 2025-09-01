/**
 * Returns a color from RGB values.
 *
 * If only one or two values are specified, the
 * unspecified value(s) will always default to the value of `red`.
 *
 * @param red the R value (0 - 255)
 * @param green the G value (0 - 255)
 * @param blue the B value (0 - 255)
 */
export function rgb(red: number, green = red, blue = red) {
	return Color3.fromRGB(red, green, blue);
}

/**
 * Returns a color from the given decimal hex value.
 *
 * From https://github.com/grilme99/tabletop-island/blob/main/src/shared/util/color-utils.ts
 *
 * @param decimal the decimal hex value
 * @returns the color
 */
export function hex(decimal: number): Color3;

/**
 * Returns a color from the given hex string. This operation
 * automatically removes any hashes (#) from the input
 * string, attempting to just extract the encoded decimal.
 *
 * This uses `tonumber(inputWithoutHashes, 16)` to extract the
 * hexadecimal value of the string.
 *
 * @param hex The hex string, ex: `#ff770` or `ff770`.
 * @returns The color, or undefined if it was unable to conver to a color.
 */
export function hex(hex: string): Color3 | undefined;

export function hex(hex: string | number) {
	const decimal = typeIs(hex, 'number') ? hex : tonumber(hex.gsub('#', ''), 16);
	if (decimal === undefined) return;

	return rgb(
		bit32.band(bit32.rshift(decimal, 16), 2 ** 8 - 1),
		bit32.band(bit32.rshift(decimal, 8), 2 ** 8 - 1),
		bit32.band(decimal, 2 ** 8 - 1),
	);
}

/**
 * Encodes the given color to a string that can be used in a
 * rich text enabled location.
 *
 * From https://github.com/grilme99/tabletop-island/blob/main/src/shared/util/color-utils.ts
 *
 * @param color the color to encode
 * @returns the encoded color in the form of `rgb(r, g, b)`
 */
export function toRichText(color: Color3) {
	return `rgb(${math.round(color.R * 255)}, ${math.round(color.G * 255)}, ${math.round(
		color.B * 255,
	)})`;
}

/**
 * Returns the input color darkened by the given percentage.
 *
 * @param color the color to darken
 * @param perc the percentage to darken the color by
 */
export function darken(color: Color3, perc: number) {
	return new Color3(color.R * perc, color.G * perc, color.B * perc);
}

/**
 * Returns the input color lightened by the given percentage.
 *
 * @param color the color to lighten
 * @param perc the percentage to lighten the color by
 */
export function lighten(color: Color3, perc: number) {
	return new Color3(
		perc + (1 - perc) * color.R,
		perc + (1 - perc) * color.G,
		perc + (1 - perc) * color.B,
	);
}

/**
 * Inverts the given color.
 *
 * @param color the color to invert
 * @returns the inverted color
 */
export function invert(color: Color3) {
	return new Color3(1 - color.R, 1 - color.G, 1 - color.B);
}

/**
 * Encodes a color into an unsigned 24bit integer.
 *
 * @param color the color to encode
 * @returns the encoded unsigned integer
 */
export function toUInt24(color: Color3) {
	const r = color.R * 255;
	const g = color.G * 255;
	const b = color.B * 255;

	return bit32.bor(bit32.bor(bit32.lshift(r, 16), bit32.lshift(g, 8)), bit32.lshift(b, 0));
}

/**
 * Decodes an unsigned 24bit integer into a color.
 *
 * @param colorInt the unsigned integer to decode
 * @returns the decoded color
 */
export function fromUInt24(colorInt: number) {
	const uint24 = math.clamp(colorInt, 0, 16777215);

	const r = bit32.rshift(bit32.band(uint24, 16711680), 16);
	const g = bit32.rshift(bit32.band(uint24, 65280), 8);
	const b = bit32.rshift(bit32.band(uint24, 255), 0);

	return Color3.fromRGB(r, g, b);
}

/**
 * Returns the given list of colors evenly spread out into a ColorSequence.
 *
 * @param colors the list of colors to spread out
 * @returns the spread out list of colors
 */
export function sequence(...colors: Color3[]) {
	const size = colors.size();
	if (size === 0) return new ColorSequence(WHITE);
	else if (size === 1) return new ColorSequence(colors[0]);

	const keypoints: ColorSequenceKeypoint[] = [];

	const timeSpacing = 1 / (size - 1);

	let i = 0;
	for (const color of colors) {
		const time = timeSpacing * i++;
		keypoints.push(new ColorSequenceKeypoint(time, color));
	}

	return new ColorSequence(keypoints);
}

export const WHITE = rgb(255, 255, 255);
export const BLACK = rgb(0, 0, 0);
export const RED = rgb(255, 0, 0);
export const GREEN = rgb(0, 255, 0);
export const BLUE = rgb(0, 0, 255);
export const YELLOW = rgb(255, 255, 0);
export const CYAN = rgb(0, 255, 255);
export const MAGENTA = rgb(255, 0, 255);
export const ORANGE = rgb(255, 128, 0);
export const BROWN = rgb(128, 64, 0);
export const PURPLE = rgb(128, 0, 128);
export const PINK = rgb(255, 192, 203);
export const LIME = rgb(0, 255, 0);
export const TEAL = rgb(0, 128, 128);
export const SALMON = rgb(250, 128, 114);
export const MAROON = rgb(128, 0, 0);
export const OLIVE = rgb(128, 128, 0);
export const NAVY = rgb(0, 0, 128);
export const AQUA = rgb(0, 255, 255);
export const GRAY = rgb(128, 128, 128);
export const LIGHT_PINK = rgb(165, 105, 149);
export const LIGHT_BLUE = rgb(135, 206, 250);
export const LIGHT_GREEN = rgb(144, 238, 144);

export const RAINBOW = sequence(RED, YELLOW, GREEN, CYAN, BLUE, MAGENTA);
export const PASTEL = sequence(LIGHT_PINK, LIGHT_BLUE);
export const SUNSET = sequence(ORANGE, LIME, PINK, SALMON, MAROON, OLIVE);
export const NIGHT = sequence(NAVY, AQUA, GRAY);
