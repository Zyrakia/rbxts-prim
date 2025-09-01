import { Workspace } from '@rbxts/services';

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
 * @param fin the ending timestamp (default {@link now})
 * @return the difference between the two timestamps, in the same unit as both timestamps
 */
export function diff(start: number, fin = now()) {
	const diff = fin - start;
	return diff;
}
