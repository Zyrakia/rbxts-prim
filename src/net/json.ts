import { HttpService } from '@rbxts/services';
import { t } from '@rbxts/t';

/**
 * Encodes a piece of data as JSON and returns it.
 *
 * @param data the data to encode
 * @return the encoded data
 */
export function encode(data: unknown) {
	return HttpService.JSONEncode(data);
}

/**
 * Decodes a JSON string into an object.
 *
 * @param encoded the encoded JSON
 * @param schema a schema that the data is checked against before returning, optional
 * @return the data, or nothing if the data did not pass the schema
 */
export function decode<T>(encoded: string, schema: t.check<T>): T;

/**
 * Decodes a JSON string into an object.
 *
 * @param encoded the encoded JSON
 * @return the decoded data
 */
export function decode(encoded: string): unknown;

export function decode(encoded: string, schema?: t.check<unknown>) {
	const res = HttpService.JSONDecode(encoded);
	if (schema) {
		if (schema(res)) return res;
	} else return res;
}
