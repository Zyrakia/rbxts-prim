import { HttpService } from '@rbxts/services';

/**
 * Generates and returns a random 36 character UUID.
 *
 * @see {@link HttpService.GenerateGUID}
 */
export function uuid() {
	return HttpService.GenerateGUID();
}
