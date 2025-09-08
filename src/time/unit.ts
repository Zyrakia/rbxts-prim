import { Collection } from 'data';
import { typedLiteralFactory } from 'type-helpers';

export type TimeUnit = { seconds: number; name: string; symbol: string };

export const Unit = typedLiteralFactory<Record<string, TimeUnit>>()({
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
 * Sorts an array of time units.
 *
 * @param units the units to sort (occurs in plce)
 * @param dir the direction of the sort, default `'asc'`
 * @return the sorted units for convenience, but the sort happens in-place
 */
function sortUnits(units: TimeUnit[], dir: 'asc' | 'desc' = 'asc') {
	return units.sort(({ seconds: a }, { seconds: b }) => (dir === 'asc' ? a < b : a > b));
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
/**
 * Deconstructs (or "disects") a total number of seconds into specified time units.
 *
 * The provided `units` are internally sorted in descending order based on their
 * duration. The function then iteratively "consumes" as many of the input
 * seconds as possible for each unit, passing any remainder to the next
 * smaller unit.
 *
 * If `SECOND` is not within the provided units, it will be added to the end
 * of the result, with a value of any remaining seconds that were unconsumed
 * by another unit.
 *
 * @param seconds the total number of seconds to deconstruct
 * @param units the time units to use for deconstruction
 * @returns an array with each entry containing a `unit` and the `amount` of seconds it consumed, in
 * descending order based on the size of the unit
 */
export function disect(seconds: number, ...units: TimeUnit[]) {
	const targetUnits = sortUnits(units, 'desc');
	const res: { unit: TimeUnit; amount: number }[] = [];

	let remainingSeconds = seconds;
	for (const unit of targetUnits) {
		const unitSeconds = unit.seconds;

		const unitAmount = math.floor(remainingSeconds / unitSeconds);
		remainingSeconds -= unitAmount * unitSeconds;

		res.push({ unit, amount: unitAmount });
	}

	const existing = res.find((v) => v.unit === Unit.SECOND);
	if (existing) existing.amount += remainingSeconds;
	else res.push({ unit: Unit.SECOND, amount: remainingSeconds });

	return res;
}
