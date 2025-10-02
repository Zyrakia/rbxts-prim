import { UserInputService, Workspace } from '@rbxts/services';

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
						 * Cannot be specified when in `exclude` mode.
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
export function makeParams(init: Partial<ParamsInit> = {}) {
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

export type ParamsLike = Partial<ParamsInit> | RaycastParams;

/**
 * Resolves a raycast params like object into
 * a `RaycastParams` object.
 */
export function resolveParamsLike(paramsLike?: ParamsLike) {
	if (!paramsLike) return new RaycastParams();

	if (typeIs(paramsLike, 'RaycastParams')) return paramsLike;
	return makeParams(paramsLike);
}

/**
 * Clones all of the properties from one raycast
 * params object into a newly constructed one.
 */
export function cloneParams(params: RaycastParams) {
	const newParams = new RaycastParams();

	newParams.BruteForceAllSlow = params.BruteForceAllSlow;
	newParams.CollisionGroup = params.CollisionGroup;
	newParams.FilterDescendantsInstances = [...params.FilterDescendantsInstances];
	newParams.FilterType = params.FilterType;
	newParams.IgnoreWater = params.IgnoreWater;
	newParams.RespectCanCollide = params.RespectCanCollide;

	return newParams;
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
 * instances removed from the `FilterDescendantsInstances`
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
 * and pointing towards the given viewport pixel in world space.
 *
 * @param pixelPosition the pixel coordinates on the viewport
 * @param depth how far (in studs) in front of the camera the ray should originate, default `0`
 * @return the constructed ray
 */
export function rayFromViewport(pixelPosition: Vector2, depth?: number) {
	const cam = Workspace.CurrentCamera;
	assert(cam, 'Cannot cast from viewport without workspace camera');
	return cam.ViewportPointToRay(pixelPosition.X, pixelPosition.Y, depth);
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
	return rayFromViewport(mousePos, depth);
}

/**
 * Returns a unit ray originating at a part's position,
 * and pointing towards the same direction as the part's `LookVector`.
 *
 * @param part the part defining the ray parameters
 * @return the constructed ray
 */
export function rayFromPart(part: BasePart) {
	return new Ray(part.Position, part.CFrame.LookVector);
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
	return Workspace.Raycast(origin, direction, resolveParamsLike(params));
}

/**
 * Performs a raycast using a unit ray and a maximum distance.
 *
 * @param ray the unit ray to derive origin and direction from
 * @param length the maximum distance (in studs) to cast the ray
 * @param params optional raycast parameters
 * @returns the result of the raycast, if anything was hit
 */
export function fireUnitRay(ray: Ray, length: number, params?: ParamsLike) {
	return Workspace.Raycast(ray.Origin, ray.Direction.mul(length), resolveParamsLike(params));
}

interface PierceOptions {
	/**
	 * The maximum amount of hits before the
	 * ray is stopped early.
	 *
	 * Default: `3`
	 */
	maxHits: number;

	/**
	 * The parameters of the raycast.
	 *
	 * Any set `FilterType` will always be set to `Exclude`,
	 * because piercing casts require it.
	 */
	params: RaycastParams | Omit<Partial<ParamsInit>, 'include'>;

	/**
	 * A small stud amount to nudge each origin
	 * by to avoid casting on the surface of
	 * the previously hit part.
	 *
	 * Default: `0.01`
	 */
	epsilon: number;

	/**
	 * An optional hit handler that can decide to terminate the pierce
	 * early by returning `false`.
	 */
	onHit?: (hit: RaycastResult, hitCount: number, opts: Readonly<PierceOptions>) => void | boolean;
}

type CastStrategy = (origin: Vector3, direction: Vector3, params: RaycastParams) => RaycastResult | undefined;

/**
 * Performs a piercing cast, which continues past hits up to a limit,
 * using an origin and direction.
 *
 * @param origin the starting point of the cast
 * @param direction the direction of the cast, with its magnitude determining the length
 * @param cast the casting strategy
 * @param init optional {@link PierceOptions}
 * @returns an array containing all of the hits this cast produced
 */
function pierceCast(
	origin: Vector3,
	direction: Vector3,
	cast: CastStrategy,
	init: Partial<PierceOptions> = {},
) {
	const hits = new Array<RaycastResult>();
	const options: PierceOptions = {
		epsilon: 0.01,
		maxHits: 3,
		params: {},
		...init,
	};

	let nextOrigin = origin;
	let nextDirection = direction;

	const params = cloneParams(resolveParamsLike(options.params));
	params.FilterType = Enum.RaycastFilterType.Exclude;

	while (hits.size() < options.maxHits) {
		const res = cast(nextOrigin, nextDirection, params);
		if (!res) break;

		hits.push(res);
		if (options.onHit) {
			const shouldContinue = options.onHit(res, hits.size(), options);
			if (shouldContinue === false) break;
		}

		appendFilter(params, res.Instance);

		const mag = nextDirection.Magnitude;
		const studsToEnd = mag - res.Distance;
		if (mag <= 1e-6 || studsToEnd <= options.epsilon) break;

		const unit = nextDirection.div(mag);
		nextOrigin = res.Position.add(unit.mul(options.epsilon));
		nextDirection = unit.mul(studsToEnd - options.epsilon);
	}

	return hits;
}

/**
 * Performs a piercing raycast, which continues past hits up to a limit,
 * using an origin and direction.
 *
 * @param origin the starting point of the ray
 * @param direction the direction of the ray, with its magnitude determining the ray length
 * @param init optional {@link PierceOptions}
 * @returns an array containing all of the hits this cast produced
 */
export function pierce(origin: Vector3, direction: Vector3, init?: Partial<PierceOptions>) {
	return pierceCast(origin, direction, (o, d, p) => Workspace.Raycast(o, d, p), init);
}

/**
 * Performs a piercing raycast, which continues past hits up to a limit,
 * using a unit ray origin and direction.
 *
 * @param ray the unit ray to derive origin and direction from
 * @param length the maximum distance (in studs) to cast the ray
 * @param init optional {@link PierceOptions}
 * @returns an array containing all of the hits this cast produced
 */
export function pierceUnitRay(ray: Ray, length: number, init?: Partial<PierceOptions>) {
	return pierce(ray.Origin, ray.Direction.mul(length), init);
}

/**
 * Performs a sphere cast using an origin, radius and direction.
 *
 * @param origin the initial position of the sphere
 * @param radius the radius of the sphere
 * @param direction the direction the sphere will cast, with the magnitude determining the maximum cast distance
 * @param params optional raycast parameters
 * @returns the result of the sphere cast, if anything was hit
 */
export function fireSphere(origin: Vector3, radius: number, direction: Vector3, params?: ParamsLike) {
	return Workspace.Spherecast(origin, radius, direction, resolveParamsLike(params));
}

/**
 * Performs a piercing spherecast, which continues past hits up to a limit,
 * using an origin, radius and direction.
 *
 * @param origin the starting point of the sphere
 * @param radius the radius of the sphere
 * @param direction the direction of the sphere, with the magnitude determining the maximum cast
 * distance
 * @param init optional {@link PierceOptions}
 * @returns an array containing all of the hits this cast produced
 */
export function pierceSphere(
	origin: Vector3,
	radius: number,
	direction: Vector3,
	init?: Partial<PierceOptions>,
) {
	const cast: CastStrategy = (o, d, p) => fireSphere(o, radius, d, p);
	return pierceCast(origin, direction, cast, init);
}

/**
 * Performs a block cast using an origin, size and direction.
 *
 * @param origin the initial position of the block
 * @param size the size of the block
 * @param direction the direction the block will cast, with the magnitude determining the maximum cast distance
 * @param params optional raycast parameters
 * @return the result of the block cast, if anything was hit
 */
export function fireBlock(
	origin: Vector3,
	size: Vector3,
	direction: Vector3,
	params?: ParamsLike,
): RaycastResult | undefined;

/**
 * Performs a block cast using an origin (position and direction), size and
 * distance.
 *
 * @param origin the initial position and facing direction of the block
 * @param size the size of the block
 * @param distance the maximum distance the block will cast towards where it is looking
 * @param params optional raycast parameters
 * @return the result of the block cast, if anything was hit
 */
export function fireBlock(
	origin: CFrame,
	size: Vector3,
	distance: number,
	params?: ParamsLike,
): RaycastResult | undefined;

export function fireBlock(
	origin: Vector3 | CFrame,
	size: Vector3,
	dirOrDist: Vector3 | number,
	params?: ParamsLike,
) {
	const originCf = typeIs(origin, 'Vector3') ? new CFrame(origin) : origin;
	const direction = typeIs(dirOrDist, 'number') ? originCf.LookVector.mul(dirOrDist) : dirOrDist;

	return Workspace.Blockcast(originCf, size, direction, resolveParamsLike(params));
}

/**
 * Performs a piercing block cast, which continues past hits up to a limit,
 * using an origin, radius and direction.
 *
 * @param origin the initial position of the block
 * @param size the size of the block
 * @param direction the direction the block will cast, with the magnitude determining the maximum cast distance
 * @param init optional {@link PierceOptions}
 * @returns an array containing all of the hits this cast produced
 */
export function pierceBlock(
	origin: Vector3,
	size: Vector3,
	direction: Vector3,
	init?: Partial<PierceOptions>,
): RaycastResult[];

/**
 * Performs a piercing block cast, which continues past hits up to a limit,
 * using an origin, radius and direction.
 *
 * @param origin the initial position and facing direction of the block
 * @param size the size of the block
 * @param distance the maximum distance the block will cast towards where it is looking
 * @param init optional {@link PierceOptions}
 * @returns an array containing all of the hits this cast produced
 */
export function pierceBlock(
	origin: CFrame,
	size: Vector3,
	distance: number,
	init?: Partial<PierceOptions>,
): RaycastResult[];

export function pierceBlock(
	origin: Vector3 | CFrame,
	size: Vector3,
	dirOrDist: Vector3 | number,
	init?: Partial<PierceOptions>,
) {
	const originCf = typeIs(origin, 'Vector3') ? new CFrame(origin) : origin;
	const direction = typeIs(dirOrDist, 'number') ? originCf.LookVector.mul(dirOrDist) : dirOrDist;

	const cast: CastStrategy = (o, d, p) => {
		const newOrigin = CFrame.fromMatrix(o, originCf.XVector, originCf.YVector, originCf.ZVector);

		return Workspace.Blockcast(newOrigin, size, d, p);
	};

	return pierceCast(originCf.Position, direction, cast, init);
}
