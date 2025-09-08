import * as Time from '../time';
import { setTimeout, Timeout } from './interval';

export class Throttle {
	private timeoutSeconds!: number;

	private lastPass?: number;
	private locked = false;

	/**
	 * Creates a new throttle.
	 *
	 * @param timeoutMs the timeout between passes in milliseconds
	 */
	public constructor(timeoutMs: number) {
		this.setTimeout(timeoutMs);
	}

	/**
	 * Wraps a function with a throttle so that the function will only execute once
	 * before being blocked for a specific timeout.
	 *
	 * When invocation is attempted while the throttle is
	 * not ready, the result will immediately be `undefined`.
	 *
	 * @param fn the function to wrap
	 * @param timeoutMs the minimum delay between executions
	 * @return the throttle wrapper function
	 */
	public static wrap<A extends any[], R>(fn: (...args: A) => R, timeoutMs: number) {
		const throttle = new Throttle(timeoutMs);
		return (...args: A) => {
			if (throttle.tryPass()) return fn(...args);
		};
	}

	/**
	 * Returns whether this throttle can currently pass.
	 *
	 * This does not trigger the throttle,
	 * it only inspects the state.
	 */
	public canPass() {
		if (this.locked) return false;

		const remaining = this.getRemainingTimeout();
		return remaining === 0;
	}

	/**
	 * Attempts to pass this throttle.
	 *
	 * If the throttle passed, it will not pass again until
	 * the timeout has elapsed.
	 *
	 * @returns `true` if the throttle passed, `false` otherwise
	 */
	public tryPass() {
		if (!this.canPass()) return false;

		this.lastPass = Time.now();
		return true;
	}

	/**
	 * Returns the remaining time (in seconds) before this
	 * throttle can pass.
	 */
	private getRemainingTimeout() {
		if (!this.lastPass) return 0;
		const diffSeconds = Time.diff(this.lastPass, Time.now());
		return math.max(0, this.timeoutSeconds - diffSeconds);
	}

	/**
	 * Returns the timestamp of when this throttle
	 * last passed.
	 */
	public getLastPass() {
		return this.lastPass;
	}

	/**
	 * Resets the last time at which this throttle passed,
	 * allowing any next pass attempt to go through immediately.
	 */
	public resetLastPass() {
		this.lastPass = undefined;
	}

	/**
	 * Locks this throttle, blocking passes until unlocked.
	 */
	public lock() {
		this.locked = true;
	}

	/**
	 * Unlocks this throttle, allowing passes.
	 */
	public unlock() {
		this.locked = false;
	}

	/**
	 * Sets the locked state of this throttle.
	 *
	 * When locked, this throttle will never pass.
	 */
	public setLocked(locked: boolean) {
		this.locked = locked;
	}

	/**
	 * Returns whether this throttle is locked.
	 */
	public isLocked() {
		return this.locked;
	}

	/**
	 * Returns the current timeout (in milliseconds) .
	 */
	public getTimeout() {
		return Time.convert(this.timeoutSeconds, Time.Unit.SECOND, Time.Unit.MINUTE);
	}

	/**
	 * Replaces the current timeout. This is applied
	 * immediately.
	 */
	public setTimeout(timeoutMs: number) {
		this.timeoutSeconds = Time.convert(timeoutMs, Time.Unit.MILLI, Time.Unit.SECOND);
	}
}

export class Debounce {
	private scheduled?: () => void;
	private scheduler?: Timeout;

	/**
	 * Creates a new debounce. This debounce executes on the trailing edge
	 * of the timeout.
	 *
	 * @param timeoutMs the schedule delay
	 */
	public constructor(private timeoutMs: number) {}

	/**
	 * Clears the currently planned schedule, if any.
	 */
	public clear() {
		this.scheduler?.destroy();
		this.scheduler = undefined;

		this.scheduled = undefined;
	}

	/**
	 * Immediately executes any scheduled callback, if any, and clears
	 * the planned schedule.
	 */
	public flush() {
		if (!this.scheduled) return;
		this.scheduler?.destroy();
		this.scheduled();
		this.clear();
	}

	/**
	 * Schedules a callback for execution with the specified arguments.
	 *
	 * Clears any previously scheduled callback.
	 *
	 * @param cb the callback of schedule
	 * @param args the arguments to pass
	 */
	public schedule<A extends any[]>(cb: (...args: A) => any, ...args: A) {
		this.clear();
		this.scheduled = () => task.spawn(() => void cb(...args));
		this.scheduler = setTimeout(() => this.flush(), this.timeoutMs);
	}

	/**
	 * Returns whether this debounce has an
	 * execution scheduled.
	 */
	public isScheduled() {
		return this.scheduler?.hasExecuted() === false;
	}

	/**
	 * Returns the remaining timeout (in milliseconds), until the
	 * current scheduled execution will occur. If there is no scheduled
	 * execution, returns nothing.
	 */
	public getRemainingTimeout() {
		if (!this.scheduler || this.scheduler.hasExecuted()) return undefined;
		return this.scheduler.getRemaining();
	}

	/**
	 * Returns the current timeout (in milliseconds) .
	 */
	public getTimeout() {
		return this.timeoutMs;
	}

	/**
	 * Replaces the current timeout. This is applied
	 * on the next schedule.
	 */
	public setTimeout(timeoutMs: number) {
		this.timeoutMs = timeoutMs;
	}
}
