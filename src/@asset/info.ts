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
