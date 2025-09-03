import * as Time from '../time';

export interface Interval {
	/**
	 * Returns the amount of milliseconds remaining before the
	 * next interval execution.
	 */
	getRemaining(): number;

	/**
	 * Returns the number of milliseconds this interval
	 * waits for between each execution.
	 */
	getTimeout(): number;

	/**
	 * Adjusts the timeout, in milliseconds, for the **next** execution.
	 * If an adjustment takes place mid-wait, the **current** wait will still
	 * complete with the original timeout.
	 */
	setTimeout(ms: number): void;

	/**
	 * Destroys this interval. There will be no further
	 * executions after this is called.
	 */
	destroy(): void;

	/**
	 * Returns whether this interval has been destroyed.
	 */
	isDestroyed(): boolean;
}

export interface Timeout {
	/**
	 * Returns the amount of milliseconds remaining before the
	 * scheduled execution.
	 */
	getRemaining(): number;

	/**
	 * Returns the number of milliseconds this timeout was started with.
	 */
	getTimeout(): number;

	/**
	 * Returns whether this timeout has elapsed and the callback has executed.
	 */
	hasExecuted(): boolean;

	/**
	 * Destroys this timeout. If the timeout has not elapsed yet, no
	 * execution will happen, otherwise this does nothing.
	 */
	destroy(): void;

	/**
	 * Returns whether this timeout has been destroyed.
	 */
	isDestroyed(): boolean;
}

const sToMs = (ms: number) => Time.convert(ms, Time.Unit.MILLI, Time.Unit.SECOND);
const msToS = (s: number) => Time.convert(s, Time.Unit.SECOND, Time.Unit.MILLI);

/**
 * Schedules a callback to be executed every `timeoutMs` milliseconds.
 *
 * @param cb the callback to schedule
 * @param timeoutMs the initial timeout milliseconds between executions
 * @param args the arguments to pass to the callback
 * @return an interval handle to control the interval
 */
export function setInterval<T extends any[]>(
	cb: (...args: T) => void,
	timeoutMs: number,
	...args: T
) {
	let timeout = sToMs(timeoutMs);
	let destroyed = false;

	let latest: { timeout: number; start: number } | undefined;
	task.spawn(() => {
		while (!destroyed) {
			latest = { timeout, start: Time.now() };
			task.wait(timeout);
			latest = undefined;

			if (destroyed) break;
			void cb(...args);
		}
	});

	return {
		getRemaining: () => {
			if (!latest) return 0;
			const { timeout, start } = latest;

			const elapsed = Time.diff(start, Time.now());
			const remaining = math.max(0, timeout - elapsed);

			return msToS(remaining);
		},

		getTimeout: () => msToS(timeout),
		setTimeout: (ms) => void (timeout = sToMs(ms)),
		destroy: () => void (destroyed = true),
		isDestroyed: () => destroyed,
	} satisfies Interval;
}

/**
 * Schedules a callback to be executed **immediately (next scheduler tick)**, **and** every `timeoutMs` milliseconds.
 *
 * @param cb the callback to schedule
 * @param timeoutMs the initial timeout milliseconds between executions
 * @param args the arguments to pass to the callback
 * @return an interval handle to control the interval
 */
export function setIntervalNow<T extends any[]>(
	cb: (...args: T) => void,
	timeoutMs: number,
	...args: T
) {
	task.spawn(() => void cb(...args));
	return setInterval(cb, timeoutMs, ...args);
}

/**
 * Schedules a callback to be executed in `timeoutMs` milliseconds.
 *
 * @param cb the callback to schedule
 * @param timeoutMs the millisecond delay before execution
 * @param args the arguments to pass to the callback on execution
 * @return a timeout handle to control the timeout
 */
export function setTimeout<T extends any[]>(
	cb: (...args: T) => void,
	timeoutMs: number,
	...args: T
) {
	const timeout = msToS(timeoutMs);

	let start: number | undefined;
	let destroyed = false;
	let executed = false;

	task.spawn(() => {
		start = Time.now();
		task.wait(timeout);
		start = undefined;

		if (destroyed) return;

		executed = true;
		cb(...args);
	});

	return {
		getRemaining: () => {
			if (!start) return 0;

			const elapsed = Time.diff(start, Time.now());
			const remaining = math.max(0, timeout - elapsed);

			return msToS(remaining);
		},

		getTimeout: () => sToMs(timeout),
		hasExecuted: () => executed,
		destroy: () => void (destroyed = true),
		isDestroyed: () => destroyed,
	} satisfies Timeout;
}

/**
 * Returns a promise that resolves in `ms` milliseconds.
 *
 * @param ms the number of milliseconds to sleep
 * @return a promise that resolves after the sleep duration
 */
export function sleep(ms: number) {
	return new Promise<void>((resolve) => {
		task.wait(msToS(ms));
		resolve();
	});
}
