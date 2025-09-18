import { ContentProvider } from '@rbxts/services';

interface PreloadResult {
	contentId: string;
	status: Enum.AssetFetchStatus;
}

/**
 * Traverses the input and recursively preloads all content in the passed instances,
 * or directly preloads the content if it is a content ID string.
 *
 * @param content an array containing content IDs or instances to preload
 * @return every preloaded content ID and it's preload result
 */
export async function preload(...content: (Instance | string)[]) {
	const loaded: PreloadResult[] = [];

	ContentProvider.PreloadAsync(content, (contentId, status) => {
		loaded.push({ contentId, status });
	});

	return loaded;
}

/**
 * Begins recursively preloading a given instance, but immediately returns it.
 *
 * The result will not be accessible, the preloading will be started and
 * then finish asynchronously after this function has returned.
 *
 * @param instance the instance to preload
 * @return the input instance
 */
export function preloadReturn<T extends Instance>(instance: T) {
	task.spawn(() => ContentProvider.PreloadAsync([instance]));
	return instance;
}
