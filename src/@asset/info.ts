import { MarketplaceService } from '@rbxts/services';

/**
 * Fetches the product info for an asset ID.
 *
 * @param assetId the ID of the marketplace item
 * @param infoType the type of asset the ID is associated with
 * @return the info, or nothing if the ID is invalid
 */
export function getInfo(assetId: number): Promise<AssetProductInfo | undefined>;

export function getInfo(
	assetId: number,
	infoType: CastsToEnum<Enum.InfoType.Bundle>,
): Promise<BundleInfo | undefined>;

export function getInfo(
	assetId: number,
	infoType: CastsToEnum<Enum.InfoType.GamePass>,
): Promise<GamePassProductInfo | undefined>;

export function getInfo(
	assetId: number,
	infoType: CastsToEnum<Enum.InfoType.Product>,
): Promise<DeveloperProductInfo | undefined>;

export function getInfo(
	assetId: number,
	infoType: CastsToEnum<Enum.InfoType.Subscription>,
): Promise<SubscriptionProductInfo | undefined>;

export function getInfo(
	assetId: number,
	infoType?: CastsToEnum<Enum.InfoType>,
): Promise<
	| AssetProductInfo
	| BundleInfo
	| GamePassProductInfo
	| DeveloperProductInfo
	| SubscriptionProductInfo
	| undefined
>;

export async function getInfo(assetId: number, infoType?: CastsToEnum<Enum.InfoType>) {
	try {
		return MarketplaceService.GetProductInfo(assetId, infoType);
	} catch (err) {}
}

/**
 * Returns whether the given asset ID is associated with an asset that
 * is of one of the specified types.
 *
 * This will fetch the asset info from the marketplace to obtain
 * the type of the asset.
 *
 * @param assetId the asset ID to check
 * @param oneOfType the types to check the asset against
 * @return whether the asset is valid and of one of the specified types
 */
export async function isType(assetId: number, ...oneOfType: Enum.AssetType[]) {
	const info = await getInfo(assetId);
	if (!info) return false;

	const assetType = Enum.AssetType.GetEnumItems().find((v) => v.Value === info.AssetTypeId);
	if (!assetType) return false;

	return oneOfType.includes(assetType);
}
