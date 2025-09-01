import { RunService } from '@rbxts/services';
import * as Time from '../time';

/**
 * Holds the result of a benchmark and allows for inspection.
 */
class BenchmarkResult {
	/**
	 * Creates a new result.
	 *
	 * @param totalSeconds the total seconds elapsed in the benchmark
	 * @param runCount the amount of times the benchmark ran
	 * @param opName the name of the benchmark
	 */
	public constructor(
		private readonly totalSeconds: number,
		private readonly runCount: number,
		private readonly opName?: string,
	) {}

	/**
	 * Returns the result of the benchmark in
	 * a readable and consistent format. Depending on
	 * how long the benchmark took, it will show different
	 * units. If the benchmark was run multiple times it will
	 * show the total time and the average time, with the amount
	 * of runs that were performed.
	 *
	 * Format:
	 * `Benchmark({opName}?): {runTime} μs/ms/s ({totalTime?} μs/ms/s for {runCount} runs)`
	 *
	 * @param opName the name of the operation being benchmarked
	 * @returns the benchmark result in a readable format
	 */
	public getMessage(opName = this.opName) {
		return `${this.formatName(opName)} ${
			this.runCount > 1
				? `${this.formatTotalPerRun()} (${this.formatTotal()} for ${this.runCount} runs)`
				: `${this.formatTotal()}`
		}`;
	}

	/**
	 * Writes the benchmark result to the console, in a readable
	 * and consistent format. This just prints the result of
	 * {@link getMessage} to the console.
	 *
	 * @param opName the name of the operation being benchmarked
	 */
	public write(opName?: string) {
		print(this.getMessage(opName));
	}

	/**
	 * Writes if running as client.
	 *
	 * @param opName the name of the operation being benchmarked
	 */
	public writeIfClient(opName?: string) {
		if (RunService.IsClient()) this.write(opName);
	}

	/**
	 * Writes if running as server.
	 *
	 * @param opName the name of the operation being benchmarked
	 */
	public writeIfServer(opName?: string) {
		if (RunService.IsServer()) this.write(opName);
	}

	/**
	 * Writes if running in studio.
	 *
	 * @param opName the name of the operation being benchmarked
	 */
	public writeIfStudio(opName?: string) {
		if (RunService.IsStudio()) this.write(opName);
	}

	/**
	 * Writes only if the specific condition is true.
	 *
	 * @param condition the condition to check
	 * @param opName the name of the operation being benchmarked
	 */
	public writeIf(condition: boolean, opName?: string) {
		if (condition) this.write(opName);
	}

	/**
	 * Returns the elapsed time of the benchmark in seconds.
	 */
	public getSeconds() {
		return this.totalSeconds;
	}

	/**
	 * Returns the average time in seconds.
	 */
	public getSecondsPerRun() {
		return this.totalSeconds / this.runCount;
	}

	/**
	 * Returns the elapsed time of the benchmark in milliseconds.
	 */
	public getMillis() {
		return Time.convert(this.totalSeconds, Time.Unit.SECOND, Time.Unit.MILLI);
	}

	/**
	 * Returns the average time in milliseconds.
	 */
	public getMillisPerRun() {
		return this.getMillis() / this.runCount;
	}

	/**
	 * Returns the elapsed time of the benchmark in microseconds.
	 */
	public getMicros() {
		return Time.convert(this.totalSeconds, Time.Unit.SECOND, Time.Unit.MICRO);
	}

	/**
	 * Returns the average time in microseconds.
	 */
	public getMicrosPerRun() {
		return this.getMicros() / this.runCount;
	}

	/**
	 * Formats the total run time of the benchmark with
	 * the appropriate unit.
	 */
	private formatTotal() {
		return this.formatSeconds(this.getSeconds());
	}

	/**
	 * Formats the average run time of each benchmark iteration
	 * with the appropriate unit.
	 */
	private formatTotalPerRun() {
		return this.formatSeconds(this.getSecondsPerRun());
	}

	/**
	 * Determines the correct display unit for a specific
	 * seconds duration and returns the seconds
	 * formatted as that unit.
	 */
	private formatSeconds(seconds: number) {
		const stepLimit = 1000;

		let value = seconds;
		let unit: Time.TimeUnit = Time.Unit.SECOND;

		const micros = Time.convert(seconds, Time.Unit.SECOND, Time.Unit.MICRO);
		if (micros < stepLimit) {
			value = micros;
			unit = Time.Unit.MICRO;
		} else {
			const millis = Time.convert(seconds, Time.Unit.SECOND, Time.Unit.MILLI);
			if (millis < stepLimit) {
				value = millis;
				unit = Time.Unit.MILLI;
			}
		}

		return `%.2f ${unit.symbol}`.format(value);
	}

	/**
	 * Formats the name of the benchmark depending
	 * on if an operation name was provided.
	 */
	private formatName(opName = this.opName) {
		return `Benchmark${opName ? `(${opName})` : ''}:`;
	}
}

/** Tracks the start timestamp of actively running benchmarks by their ID.  */
const runningBenchmarks = new Map<string, number>();

/**
 * Runs a benchmark and returns a few utility functions to use the elapsed time.
 *
 * @param f the function to benchmark
 * @param runCount the number of times to run the function. Will be rounded and at least 1
 * @returns an object containing functions to use the elapsed time
 */
export function run(f: () => void, runCount = 1) {
	const runs = math.round(math.max(runCount, 1));

	const start = Time.cpu();
	for (let i = 0; i < runs; i++) f();
	const fin = Time.cpu();

	return new BenchmarkResult(Time.diff(start, fin), runs);
}

/**
 * Runs a function and returns the result of the function. In addition to returning
 * the result, it also writes the benchmark result to the console automatically.
 *
 * @param f the function to benchmark
 * @param opName the name of the operation being benchmarked
 * @returns the result of the function
 */
export function runReturn<T extends unknown>(f: () => T, opName?: string) {
	const start = Time.cpu();
	const result = f();
	const fin = Time.cpu();

	const benchmark = new BenchmarkResult(Time.diff(start, fin), 1);
	benchmark.write(opName);

	return result;
}

/**
 * Starts a benchmark with the specified ID.
 * If a benchmark with the same ID is already running, this will throw.
 *
 * This benchmark can be stopped with {@link stop}, which
 * will return the benchmark result of time time between
 * the two calls.
 *
 * @param id the ID of the benchmark
 */
export function start(id: string) {
	if (runningBenchmarks.has(id)) throw `Benchmark with id(${id}) already started.`;
	runningBenchmarks.set(id, Time.cpu());
}

/**
 * Used to stop a benchmark with the specified ID.
 * If no benchmark with the ID exists, this will throw.
 *
 * This will return the benchmark result of the time between
 * the two calls. If the opName in any of the write functions
 * is omitted, the ID of the benchmark will automatically be
 * used.
 *
 * @param id the ID of the benchmark
 * @returns the benchmark result
 */
export function stop(id: string) {
	if (!runningBenchmarks.has(id)) throw `Benchmark with id(${id}) not started.`;
	const start = runningBenchmarks.get(id)!;
	const fin = Time.cpu();

	runningBenchmarks.delete(id);

	return new BenchmarkResult(Time.diff(start, fin), 1, id);
}

/**
 * Starts a profile with the specified name, runs the function, and ends the profile.
 *
 * @param opName the name of the profile
 * @param f the function to profile
 */
export function runDebug<A extends defined[], R>(opName: string, f: (...args: A) => R, ...args: A) {
	debug.profilebegin(opName);

	try {
		const result = f(...args);
		return result;
	} finally {
		debug.profileend();
	}
}
