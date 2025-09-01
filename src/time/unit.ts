import { Collection } from 'data';
import { typedLiteralFactory } from 'type-helpers';

export type TimeUnit = { seconds: number; name: string; symbol: string };

export const Unit = typedLiteralFactory<Record<string, TimeUnit>>()({
	FEMTO: { seconds: 1e-15, name: 'femtosecond', symbol: 'fs' },
	PICO: { seconds: 1e-12, name: 'picosecond', symbol: 'ps' },
	NANO: { seconds: 1e-9, name: 'nanosecond', symbol: 'ns' },
	MICRO: { seconds: 1e-6, name: 'microsecond', symbol: 'µs' },
	MILLI: { seconds: 1e-3, name: 'millisecond', symbol: 'ms' },
	SECOND: { seconds: 1, name: 'second', symbol: 's' },
	MINUTE: { seconds: 60, name: 'minute', symbol: 'min' },
	HOUR: { seconds: 3600, name: 'hour', symbol: 'h' },
	DAY: { seconds: 86400, name: 'day', symbol: 'd' },
	WEEK: { seconds: 604800, name: 'week', symbol: 'wk' },
	MONTH: { seconds: 2592000, name: 'month', symbol: 'mo' },
	YEAR: { seconds: 31536000, name: 'year', symbol: 'yr' },
} as const);

/**
 * All time units sorted in ascending order based on the
 * amount of seconds they are equal to.
 */
const AscendingUnits = Collection.toEntryArray(Unit).sort(
	([, { seconds: a }], [, { seconds: b }]) => a < b,
);

/**
 * Converts a time value from one unit to another.
 *
 * @param value the time value to convert
 * @param from the unit of the input value
 * @param to the unit of the result
 * @return the converted value
 */
export function convert(value: number, from: TimeUnit, to: TimeUnit) {
	return (value * from.seconds) / to.seconds;
}

type StringifyMethod = (seconds: number, ...args: any[]) => string;

const StringifyStyles = typedLiteralFactory<Record<string, StringifyMethod>>()({
	/**
	 * Stringifies seconds into a string consisting of hours, minutes and seconds.
	 *
	 * @param format the format of the result, with variables `'h'` (hour), `'m'` (minute) or `'s'` (second), default `'hh:mm:ss'`
	 * @param twentyFourHour whether the inserted values will be in 24-hour format, default `false`
	 */
	clock: (seconds, format: string = 'hh:mm:ss', twentyFourHour = false) => {
		return '';
	},

	sentence: (seconds) => {
		return '';
	},
});

type StringifyStyles = typeof StringifyStyles;

/**
 * Stringifies seconds in a specific style.
 */
export function stringify<T extends keyof StringifyStyles>(
	seconds: number,
	style: T,
	...args: Parameters<StringifyStyles[T]> extends [seconds: number, ...other: infer K]
		? K
		: never[]
) {}

stringify(5, 'clock');
