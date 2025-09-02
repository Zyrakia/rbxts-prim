import { t } from '@rbxts/t';
import * as Collection from '../data/collection';

/**
 * Retrieves the value of an attribute.
 *
 * @param instance the instance to inspect
 * @param key the key of the attribute
 * @return the value of the attribute, if it's set
 */
export function get(instance: Instance, key: string): AttributeValue | undefined;

/**
 * Retrieves the value of an attribute, if it matches a type guard.
 *
 * @param instance the instance to inspect
 * @param key the key of the attribute
 * @param guard the type guard for the attribute value
 * @return the attribute value, if it passed the guard
 */
export function get<T extends AttributeValue | undefined>(
	instance: Instance,
	key: string,
	guard?: t.check<T>,
): T | undefined;

export function get(instance: Instance, key: string, guard?: t.check<AttributeValue>) {
	const value = instance.GetAttribute(key);
	return guard ? (guard(value) ? value : undefined) : value;
}

/**
 * Retrieves all attributes set on an instance.
 *
 * @param instance the instance to inspect
 * @return all attribute entries set on the instance
 */
export function getAll(instance: Instance) {
	return instance.GetAttributes();
}

/**
 * Sets an attribute on an instance.
 *
 * @param instance the instance to modify
 * @param key the attribute key to set
 * @param value the attribute value to set
 */
export function set(instance: Instance, key: string, value: AttributeValue) {
	instance.SetAttribute(key, value);
}

/**
 * Sets a record of attributes on an instance.
 *
 * @param instance the instance to modify
 * @param attributes the attributes to set
 */
export function setAll(instance: Instance, attributes: Record<string, AttributeValue>) {
	for (const [key, value] of pairs(attributes)) instance.SetAttribute(key, value);
}

/**
 * Clears the value of an attribute on an instance.
 *
 * @param instance the instance to modify
 * @param key the key to clear
 */
export function clear(instance: Instance, key: string): void;

/**
 * Clears all set attributes on an instance.
 *
 * @param instance the instance to modify
 */
export function clear(instance: Instance): void;

export function clear(instance: Instance, key?: string) {
	if (key) return void instance.SetAttribute(key, undefined);

	for (const [key] of getAll(instance)) {
		instance.SetAttribute(key, undefined);
	}
}

/**
 * Selects various attributes from an instance based on
 * a schema record.
 *
 * @param instance the instance to inspect
 * @param schema the attributes keys to select and the type guard their value must pass
 * @return a record containing all selected attributes that passed their schema
 */
export function select<T extends Record<string, t.check<AttributeValue | undefined>>>(
	instance: Instance,
	schema: T,
) {
	const res: { [K in keyof T]?: AttributeValue } = {};

	for (const [key, guard] of Collection.iterator(schema)) {
		const value = instance.GetAttribute(key);
		if (!guard(value)) continue;
		res[key as keyof T] = value;
	}

	return res as { [K in keyof T]?: T[K] extends t.check<infer V> ? V : never };
}
