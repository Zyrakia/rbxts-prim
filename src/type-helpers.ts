/**
 * A Typescript helper factory to create an object with type safety and intellisense but produce
 * an output that remains a literal type.
 *
 * Usage:
 * ```
 * type Dog = { breed: string, age: number };
 *
 * const Dogs = typedIndexableFactory<Record<string, Dog>>()({
 *     "Betsy": { breed: "Poodle", age: 5 },
 *     "Daisy": { breed: "Beagle", age: 2 }
 * });
 *
 * Dogs.Betsy // -- Resulting object has only keys `Betsy` and `Daisy`
 * ```
 */
export function typedLiteralFactory<T>() {
	return <V extends T>(v: V) => v;
}

/**
 * Utility type to access all the keys of a Roblox enum that are associated with an `EnumItem`.
 */
export type EnumKey<T extends Enum> = keyof ExtractMembers<T, EnumItem>;
