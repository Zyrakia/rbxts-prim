import { Collection, Str } from 'data';
import * as JSON from './json';

import { HttpService } from '@rbxts/services';
import { t } from '@rbxts/t';

type Method = RequestAsyncRequest['Method'];

interface CommonHeaders {
	'Content-Type':
		| 'application/json'
		| 'application/x-www-form-urlencoded'
		| 'multipart/form-data'
		| 'text/plain'
		| 'text/html'
		| 'application/xml'
		| 'application/javascript'
		| 'image/png'
		| 'image/jpeg'
		| ({} & string);
	'Accept':
		| '*/*'
		| 'application/json'
		| 'text/html'
		| 'application/xml'
		| 'application/xhtml+xml'
		| 'image/webp'
		| 'text/plain'
		| ({} & string);
	'Authorization': `Bearer ` | `Basic ` | ({} & string);
	'User-Agent': string;
	'Origin': string;
	'Cookie': string;
	'Referer': string;
	'Host': string;
}

type Headers = Partial<CommonHeaders> & Record<string, string>;

interface ClientOptions {
	/**
	 * The prefix that will be prepended to any request URL.
	 */
	prefixUrl?: string;

	/**
	 * The headers that will be included in every request.
	 */
	headers?: Headers;

	/**
	 * Whether large request bodies should be compressed (gzipped).
	 */
	compress?: boolean;
}

interface RequestOptions {
	/**
	 * The prefix that will be prepended to only this request URL.
	 *
	 * This will override the prefix URL of the current
	 * request client.
	 */
	prefixUrl?: string;

	/**
	 * The headers that will be included only in this request.
	 *
	 * These will take priority over client headers.
	 */
	headers?: Headers;

	/**
	 * The body to send alongside the request.
	 *
	 * If the body is not a string, it will be JSON encoded, and the
	 * `Content-Type` header will be overriden to equal `application/json`.
	 */
	body?: unknown;
}

/**
 * Wrapper class to produce a normalized header record.
 */
class HttpHeaders {
	private record: Record<string, string> = {};

	public constructor(init?: Record<string, string> | Map<string, string>) {
		if (!init) return;
		this.set(init);
	}

	/**
	 * Sets a header key to the specified value.
	 *
	 * @param key the header key, will be normalized
	 * @param value the header value
	 */
	public set<T extends keyof CommonHeaders>(key: T, value: CommonHeaders[T]): this;

	/**
	 * Sets a header key to the specified value.
	 *
	 * @param key the header key, will be normalized
	 * @param value the header value
	 */
	public set(key: string, value: string): this;

	/**
	 * Sets multiple header pairs at once.
	 *
	 * @param record the record of header pairs to set, keys will be normalized
	 */
	public set(record: Record<string, string> | Map<string, string>): this;

	public set(keyOrRecord: string | Record<string, string> | Map<string, string>, value?: string) {
		if (typeIs(keyOrRecord, 'string')) {
			const formattedKey = this.normalizeKey(keyOrRecord);
			if (typeIs(value, 'string')) this.record[formattedKey] = value;
			return this;
		}

		for (const [key, value] of Collection.iterator(keyOrRecord)) {
			this.set(key, value);
		}

		return this;
	}

	/**
	 * Deletes a header key.
	 *
	 * @param key the key to delete, will be normalized
	 */
	public delete(key: string) {
		delete this.record[this.normalizeKey(key)];
		return this;
	}

	/**
	 * Normalizes a header key for consistent internal lookup.
	 *
	 * Header keys will be:
	 * - lowercased
	 * - whitspace replaced by dashes
	 *
	 * @param key the key to format
	 * @return the formatted key
	 */
	private normalizeKey(key: string) {
		return Str.trim(key).lower().gsub('%s+', '-')[0];
	}

	/**
	 * Returns the current internal record of headers.
	 */
	public get(): Record<string, string>;

	/**
	 * Returns the value at a specific header key.
	 *
	 * @param key the key to retrieve, will be normalized
	 * @return the value of the key, or nothing if it is not set
	 */
	public get<T extends keyof CommonHeaders>(key: T): CommonHeaders[T] | undefined;

	/**
	 * Returns the value at a specific header key.
	 *
	 * @param key the key to retrieve, will be normalized
	 * @return the value of the key, or nothing if it is not set
	 */
	public get(key: string): string | undefined;

	public get(key?: string) {
		if (key !== undefined) {
			const formattedKey = this.normalizeKey(key);
			if (formattedKey in this.record) return this.record[formattedKey];
		} else return { ...this.record };
	}
}

/**
 * Wrapper class to provide more utility to the Roblox HTTP response object.
 */
class Response {
	public constructor(private readonly response: RequestAsyncResponse) {}

	/**
	 * Returns whether this response indicates success.
	 */
	public success() {
		return this.response.Success;
	}

	/**
	 * Returns the status code of this response.
	 */
	public status() {
		return this.response.StatusCode;
	}

	/**
	 * Returns the message associated with
	 * the status code of this response.
	 */
	public statusMessage() {
		return this.response.StatusMessage;
	}

	/**
	 * Returns a copy of the response headers.
	 */
	public headers() {
		return new HttpHeaders(this.response.Headers);
	}

	/**
	 * Returns the response body as a string.
	 */
	public text() {
		return this.response.Body;
	}

	/**
	 * Returns the response body after JSON decoding it.
	 *
	 * @param schema a schema that the decoded result is checked against, optional
	 * @return the decoded body, or nothing if it failed the schema check
	 */
	public json<T>(schema: t.check<T>): T;

	/**
	 * Returns the response body after JSON decoding it.
	 *
	 * @return the decoded body
	 */
	public json(): unknown;

	public json(schema?: t.check<any>) {
		if (schema) return JSON.decode(this.text(), schema);
		else return JSON.decode(this.text());
	}
}

/**
 * HTTP Client to wrap around the Roblox HTTP service.
 */
class RequestClient {
	public constructor(private options: ClientOptions = {}) {}

	/**
	 * Executes a `GET` request.
	 *
	 * @param url the URL of the request
	 * @param init the request-specific options
	 * @return the result of the request in a promise
	 */
	public async get(url: string, init: RequestOptions = {}) {
		return await this.request(url, 'GET', init);
	}

	/**
	 * Executes a `POST` request.
	 *
	 * @param url the URL of the request
	 * @param body the optional body of the request
	 * @param init the request-specific options
	 * @return the result of the request in a promise
	 */
	public async post(url: string, body?: unknown, init: Omit<RequestOptions, 'body'> = {}) {
		return await this.request(url, 'POST', { body, ...init });
	}

	/**
	 * Executes an HTTP request.
	 *
	 * @param url the URL of the request
	 * @param method the HTTP method of the request
	 * @param init the request-specific options
	 * @returns the result of the request in a promise
	 */
	public async request(url: string, method: Method, init: RequestOptions) {
		const headers = new HttpHeaders({ ...this.options.headers, ...init.headers });

		let body = undefined;
		if (init.body !== undefined) {
			if (typeIs(init.body, 'string')) body = init.body;
			else {
				body = HttpService.JSONEncode(init.body);
				headers.set('Content-Type', 'application/json');
			}
		}

		const res = HttpService.RequestAsync({
			Method: method,
			Url: (init.prefixUrl ?? this.options.prefixUrl ?? '') + url,
			Body: body,
			Headers: headers.get(),
			Compress: this.options.compress ? Enum.HttpCompression.Gzip : undefined,
		});

		return new Response(res);
	}

	/**
	 * Overrides the current client options.
	 *
	 * @param options the new client options
	 */
	public setOptions(options: ClientOptions) {
		this.options = options;
	}

	/**
	 * Merges a new set of options and the current client options.
	 *
	 * Any values in the new set of options take priority when merging.
	 *
	 * @param options the options to merge
	 */
	public updateOptions(options: ClientOptions) {
		this.options = {
			...this.options,
			...options,
			headers: { ...this.options.headers, ...options.headers },
		};
	}
}

/**
 * Executes a `GET` request.
 *
 * @param url the URL of the request
 * @param init the request-specific options
 * @return the result of the request, in a promise
 */
export function fetch(url: string, init?: RequestOptions): Promise<Response>;

/**
 * Creates a new request client.
 *
 * @param options the initial options of the client
 * @return the created client
 */
export function fetch(options: ClientOptions): RequestClient;

export function fetch(urlOrOpts: ClientOptions | string, reqInit?: RequestOptions) {
	const instant = typeIs(urlOrOpts, 'string');
	const client = new RequestClient(instant ? {} : urlOrOpts);

	if (instant) return client.get(urlOrOpts, reqInit);
	else return client;
}
