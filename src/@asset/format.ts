/**
 * Various Roblox asset protocols and URL snippets that can
 * be used to prefix ID numbers.
 */
export const AssetProtocol = {
	DEFAULT: 'rbxassetid://',
	BUILTIN: 'rbxasset://',
	CATALOG: 'https://www.roblox.com/asset/?id=',
	THUMBNAIL: 'rbxthumb://',
	GAME: 'rbxgameasset://',
} as const;

/**
 * Thumbnail types and the possible their possible dimension increments.
 */
interface ThumbnailTypes {
	Asset: 150 | 420;
	Avatar: 100 | 352 | 720;
	AvatarHeadShot: 48 | 60 | 150;
	BadgeIcon: 150;
	BundleThumbnail: 150 | 420;
	GameIcon: 50 | 150;
	GamePass: 150;
	GroupIcon: 150 | 420;
	Outfit: 150 | 420;
}

type AssetProtocol = (typeof AssetProtocol)[keyof typeof AssetProtocol];

/**
 * Prefixes an asset ID number with a protocol or URL snippet.
 *
 * @param assetId the ID number of the asset
 * @param protocol any string to prefix the ID
 * @return the prefixed ID
 */
export function url(
	assetId: number,
	protocol: AssetProtocol | (string & {}) = AssetProtocol.DEFAULT,
) {
	return protocol + assetId;
}

/**
 * Attempts to extracts numbers (the ID) out of a string.
 *
 * @param assetUrl the complete asset URL
 * @return the extracted ID,as a number, or nothing if it couldn't be extracted
 */
export function id(assetUrl: string) {
	const [res] = assetUrl.match('%d+');
	const id = tonumber(res);
	if (id !== undefined) return id;
}

/**
 * Returns the assetId number encoded in the Roblox thumbnail
 * protocol `rbxthumb://`, with the given asset type and dimensions.
 *
 * This `thumbnail(24813339, "Asset", 150)`
 * turns into this `rbxthumb://type=Asset&id=24813339&w=150&h=150`
 *
 * To read more about the rbxthumb protocol, see
 * [here](https://developer.roblox.com/en-us/articles/Content#rbxthumb).
 *
 * @param assetId the assetId to encode
 * @param thumbnailType the type of thumbnail
 * @param size the size of the thumbnail (used for width and height)
 * @returns the thumbnail URL
 */
export function thumbnail<T extends keyof ThumbnailTypes>(
	assetId: number,
	thumbnailType: T,
	size: ThumbnailTypes[T],
) {
	return `${AssetProtocol.THUMBNAIL}type=${thumbnailType}&id=${assetId}&w=${size}&h=${size}`;
}
