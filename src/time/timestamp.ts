import { Workspace } from '@rbxts/services';
import { Collection } from 'data';
import { typedLiteralFactory } from 'type-helpers';

type TimeUnit = { seconds: number; name: string; symbol: string };

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
const AscendingUnits = Collection.toEntryArray(Unit).sort(([, { seconds: a }], [, { seconds: b }]) => a < b);

/**
 * Returns the current unix timestamp in seconds, in UTC.
 */
export function now() {
	return os.time();
}

/**
 * Returns the current unix timestamp of the server, in seconds.
 *
 * Equivalent to `Workspace.GetServerTimeNow()`.
 */
export function serverNow() {
	return Workspace.GetServerTimeNow();
}

/**
 * Returns the current unix timestamp of the client, in seconds.
 *
 * Equivalent to `tick()`.
 */
export function localNow() {
	return tick();
}

/**
 * Returns the amount of seconds since the game
 * has started running.
 *
 * Equivalent to `time()`.
 */
export function elapsed() {
	return time();
}

/**
 * Returns the amount of CPU time used by the client, in seconds.
 * Accurate to about 1 microsecond, recommended for use in benchmarking.
 */
export function cpu() {
	return os.clock();
}

/**
 * Returns the difference between two timestamps, start and end.
 *
 * Both timestamps are assumed to be in the same unit.
 *
 * @param start the starting timestamp
 * @param end the ending timestamp (default {@link now})
 * @return the difference between the two timestamps, in the same unit as both timestamps
 */
export function diff(start: number, end = now()) {
	const diff = end - start;
	return diff;
}

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

export function stringify(timestamp: number) {}
