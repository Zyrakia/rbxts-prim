import { UserInputService, Workspace } from '@rbxts/services';

export type RayInit = { origin: Vector3; direction: Vector3 };

type ParamsInitBase = {
	/**
	 * Whether the raycast will pass through water terrain.
	 */
	ignoreWater: boolean;

	/**
	 * The collision group that the raycast will be
	 * a member of.
	 */
	collisionGroup: string;

	/**
	 * Whether the raycast will consider the `CanCollide`
	 * value of a hit part over the `CanQuery` value.
	 */
	respectCanCollide: boolean;
};

export type ParamsInit =
	| ParamsInitBase &
			(
				| {
						/**
						 * The list of instances that the
						 * raycast can intersect with.
						 */
						include: Instance[];

						/**
						 * Cannot be specified when in `include` mode.
						 */
						exclude: never;
				  }
				| {
						/**
						 * The list of instances that the raycast
						 * cannot intersect with.
						 */
						exclude: Instance[];

						/**
						 * Cannot be specifeid when in `exclude` mode.
						 */
						include: never;
				  }
			);

/**
 * Constructs `RaycastParams` from an initializer.
 *
 * @param init the raycast params initializer
 * @return the constructed params
 */
export function params(init: Partial<ParamsInit> = {}) {
	const params = new RaycastParams();

	const { include: includeList, exclude: excludeList } = init;
	const includeMode = includeList !== undefined;

	params.FilterType = includeMode ? Enum.RaycastFilterType.Include : Enum.RaycastFilterType.Exclude;
	params.FilterDescendantsInstances = includeMode ? includeList : excludeList ?? [];

	if (init.ignoreWater !== undefined) params.IgnoreWater = init.ignoreWater;
	if (init.collisionGroup !== undefined) params.CollisionGroup = init.collisionGroup;
	if (init.respectCanCollide !== undefined) params.RespectCanCollide = init.respectCanCollide;

	return params;
}

type ParamsLike = Partial<ParamsInit> | RaycastParams;

/**
 * Resolves a raycast params like object into
 * a `RaycastParams` object.
 */
function resolveParams(paramsLike?: ParamsLike) {
	if (!paramsLike) return new RaycastParams();

	if (typeIs(paramsLike, 'RaycastParams')) return paramsLike;
	return params(paramsLike);
}

/**
 * Returns the input `RaycastParams` with the specified
 * instances appended to the `FilterDescendantsInstances`
 * property.
 */
export function appendFilter(params: RaycastParams, ...instances: Instance[]) {
	params.FilterDescendantsInstances = [...params.FilterDescendantsInstances, ...instances];
	return params;
}

/**
 * Returns the input `RaycastParams` with the specified
 * instances removed from the `FitlerDescendantsInstances`
 * property.
 */
export function truncateFilter(params: RaycastParams, ...instances: Instance[]) {
	params.FilterDescendantsInstances = params.FilterDescendantsInstances.filter(
		(v) => !instances.includes(v),
	);
	return params;
}

/**
 * Returns a unit ray originating at the current Workspace camera,
 * and pointing towards the given screen pixel in world space.
 *
 * @param pixelPosition the pixel coordinates on the screen
 * @param depth how far (in studs) in front of the camera the ray should originate, default `0`
 * @return the constructed ray
 */
export function rayFromScreen(pixelPosition: Vector2, depth?: number) {
	const cam = Workspace.CurrentCamera;
	assert(cam, 'Cannot cast from screen without workspace camera');
	return cam.ScreenPointToRay(pixelPosition.X, pixelPosition.Y, depth);
}

/**
 * Returns a unit ray originating at the current Workspace camera,
 * and pointing towards where the current mouse location would
 * be in world space.
 *
 * @param depth how far (in studs) in front of the camera the ray should originate, default `0`
 * @return the constructed ray
 */
export function rayFromMouse(depth?: number) {
	const mousePos = UserInputService.GetMouseLocation();
	return rayFromScreen(mousePos, depth);
}

/**
 * Returns a unit ray originating at a part's position,
 * and pointing towards the same direction as the parts `LookVector`.
 *
 * @param part the part defining the ray parameters
 * @return the constructed ray
 */
export function rayFromPart(part: BasePart) {
	return new Ray(part.Position, part.CFrame.LookVector);
}

/**
 * Performs a raycast using a ray origin and direction.
 *
 * @param ray the ray object to raycast from
 * @param params optional raycast parameters
 * @return the result of the raycast, if anything was hit
 */
export function fireRay(ray: Ray, params?: ParamsLike) {
	return Workspace.Raycast(ray.Origin, ray.Direction, resolveParams(params));
}

/**
 * Performs a raycast using a unit ray and a maximum distance.
 *
 * @param ray a unit ray
 * @param length the maximum distance (in studs) to cast the ray
 * @param params optional raycast parameters
 * @returns the result of the raycast, if anything was hit
 */
export function fireUnitRay(ray: Ray, length: number, params?: ParamsLike) {
	return Workspace.Raycast(ray.Origin, ray.Direction.mul(length), resolveParams(params));
}

/**
 * Performs a raycast using an origin and direction.
 *
 * @param origin the starting point of the ray
 * @param direction the direction of the ray, with its magnitude determining the ray length
 * @param params optional raycast parameters
 * @returns the result of the raycast, if anything was hit
 */
export function fire(origin: Vector3, direction: Vector3, params?: ParamsLike) {
	return Workspace.Raycast(origin, direction, resolveParams(params));
}

/**
 * Performs a raycast using an origin and unit direction.
 *
 * @param origin the starting point of the ray
 * @param direction the unit direction of the ray
 * @param length the maximum distance (in studs) to cast the ray
 * @param params optional raycast parameters
 * @returns the result of the raycast, if anything was hit
 */
export function fireUnit(origin: Vector3, direction: Vector3, length: number, params?: ParamsLike) {
	return Workspace.Raycast(origin, direction.mul(length), resolveParams(params));
}

interface PierceOptions {
	/**
	 * The maximum amount of hits before the
	 * ray is stopped.
	 */
	maxHits: number;

	/**
	 * The parameters of the raycast.
	 */
	params: ParamsLike;
}

export function pierceUnit(
	origin: Vector3,
	direction: Vector3,
	length: number,
	init: Partial<PierceOptions>,
) {
	let hits = 0;
	let nextOrigin = origin;
	let nextDirection = direction;
}
