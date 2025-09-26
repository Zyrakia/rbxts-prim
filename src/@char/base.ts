import { EnumKey, typedLiteralFactory } from 'type-helpers';

/**
 * A union of all R15 character part names.
 *
 * Taken directly from the Roblox enum.
 */
export type R15BodyPart = Exclude<EnumKey<typeof Enum.BodyPartR15>, 'Unknown'>;

/**
 * A union of all R6 character part names.
 *
 * Derived directly from the Roblox enum.
 */
export type R6BodyPart = Exclude<EnumKey<typeof Enum.BodyPart>, 'Unknown'>;

type BodyPart = R15BodyPart | R6BodyPart;

/**
 * Maps Roblox character body parts to their
 * respective in-game part names.
 *
 * If a specific body part does not directly exist on an R6
 * character (R15 only parts, e.g. `UpperTorso`, `LowerTorso`),
 * the most similar part is mapped.
 */
export const R6PartNames = typedLiteralFactory<Record<BodyPart, string>>()({
	Head: 'Head',
	Torso: 'Torso',
	LeftArm: 'Left Arm',
	RightArm: 'Right Arm',
	LeftLeg: 'Left Leg',
	RightLeg: 'Right Leg',

	RootPart: 'HumanoidRootPart',

	UpperTorso: 'Torso',
	LowerTorso: 'Torso',
	LeftUpperArm: 'Left Arm',
	LeftLowerArm: 'Left Arm',
	LeftHand: 'Left Arm',
	RightUpperArm: 'Right Arm',
	RightLowerArm: 'Right Arm',
	RightHand: 'Right Arm',
	LeftUpperLeg: 'Left Leg',
	LeftLowerLeg: 'Left Leg',
	LeftFoot: 'Left Leg',
	RightUpperLeg: 'Right Leg',
	RightLowerLeg: 'Right Leg',
	RightFoot: 'Right Leg',
} as const);

/**
 * Maps Roblox character body parts to their
 * respective in-game part names.
 *
 * If a specific body part does not directly exist on at R15
 * character (R6 only parts, e.g. `Torso`, `LeftArm`, etc...),
 * the most similar part is mapped, generally the upper version.
 */
export const R15PartNames = typedLiteralFactory<Record<BodyPart, string>>()({
	Head: 'Head',
	UpperTorso: 'UpperTorso',
	LowerTorso: 'LowerTorso',
	LeftFoot: 'LeftFoot',
	LeftLowerLeg: 'LeftLowerLeg',
	LeftUpperLeg: 'LeftUpperLeg',
	RightFoot: 'RightFoot',
	RightLowerLeg: 'RightLowerLeg',
	RightUpperLeg: 'RightUpperLeg',
	LeftHand: 'LeftHand',
	LeftLowerArm: 'LeftLowerArm',
	LeftUpperArm: 'LeftUpperArm',
	RightHand: 'RightHand',
	RightLowerArm: 'RightLowerArm',
	RightUpperArm: 'RightUpperArm',

	RootPart: 'HumanoidRootPart',

	Torso: 'UpperTorso',
	LeftArm: 'LeftUpperArm',
	RightArm: 'RightUpperArm',
	LeftLeg: 'LeftUpperLeg',
	RightLeg: 'RightUpperLeg',
} as const);

/**
 * The default duration that character related `"wait"`
 * functions will wait for.
 */
export const DEFAULT_WAIT_TIMEOUT = 3;

/**
 * Resolves a the in-character part instance name for
 * a body part.
 *
 * @param bodyPart the name of the body part
 * @param rigType the target rig type, either R6 or R15, defaults to R15
 * @return the expected name of the part instance associated with the body part
 */
export function resolvePartName(
	bodyPart: BodyPart,
	rigType: Enum.HumanoidRigType = Enum.HumanoidRigType.R15,
) {
	if (rigType === Enum.HumanoidRigType.R15) {
		return R15PartNames[bodyPart];
	} else return R6PartNames[bodyPart];
}

/**
 * Returns the character of a player.
 *
 * This function will yield until the character
 * of the player is available.
 *
 * @param player the player
 * @return the character of the player
 */
export function get(player: Player) {
	return player.Character || player.CharacterAdded.Wait()[0];
}

/**
 * Returns a promise containing the character of
 * a player.
 *
 * The returning promise will resolve
 * when the character of the player
 * is available.
 *
 * @param player the player
 * @return the promise resolving to the character
 */
export async function getAsync(player: Player) {
	return get(player);
}

/**
 * Returns the `RigType` of a model, if
 * that model has a `Humanoid`.
 */
export function getRigType(model: Model) {
	const hum = getHumanoid(model);
	return hum?.RigType;
}

/**
 * Returns the `RigType` of a model, if
 * that model has a `Humanoid` present
 * within the timeout.
 */
export function waitRigType(model: Model, timeoutS: number) {
	const hum = waitHumanoid(model, timeoutS);
	return hum?.RigType;
}

/**
 * Resolves the instance name for a given body part
 * and attempts to find the part instance on a given
 * model.
 */
function getBodyPartInstance(model: Model, part: BodyPart, rigType: Enum.HumanoidRigType) {
	const partName = resolvePartName(part, rigType);
	const partInstance = model.FindFirstChild(partName);
	if (partInstance?.IsA('BasePart')) return partInstance;
}

/**
 * Resolves the instance name for a given body part
 * and waits the part instance on a given model for
 * a maximum duration.
 */
function waitBodyPartInstance(model: Model, part: BodyPart, rigType: Enum.HumanoidRigType, timeoutS: number) {
	const partName = resolvePartName(part, rigType);
	const partInstance = model.WaitForChild(partName, timeoutS);
	if (partInstance?.IsA('BasePart')) return partInstance;
}

/**
 * Returns the instance associated with the given body
 * part within the passed model (character).
 *
 * The character model is assumed to be R15.
 *
 * @param model the character model
 * @param part the body part name
 * @return the instance, if it exists within the model
 */
export function getPart(model: Model, part: BodyPart) {
	return getBodyPartInstance(model, part, Enum.HumanoidRigType.R15);
}

/**
 * Returns the instance associated with the given body
 * part within the passed model (character).
 *
 * This function will try to determine whether the passed
 * model is an R15 or R6 rig, if it cannot be
 * determined, it will default to selecting the R15
 * variant of the body part.
 *
 * @param model the character model
 * @param part the body part name
 * @return the instance, if it exists within the model
 */
export function getPartAuto(model: Model, part: BodyPart) {
	return getBodyPartInstance(model, part, getRigType(model) ?? Enum.HumanoidRigType.R15);
}

/**
 * Returns the instance associated with the given
 * body part within the passed model (character).
 *
 * The character model is assumed to be R6.
 *
 * @param model the R6 character model
 * @param part the body part name
 * @return the instance, if it exists within the model
 *
 * @see {@link getPart} for the R15 variant
 */
export function getPartR6<T extends BodyPart>(model: Model, part: T) {
	return getBodyPartInstance(model, part, Enum.HumanoidRigType.R6);
}

/**
 * Awaits the instance associated with the given body
 * part within the passed model (character).
 *
 * The character model is assumed to be R15.
 *
 * @param model the character model
 * @param part the body part name
 * @param timeoutS the maximum amount of seconds to await the part for, default {@link DEFAULT_WAIT_TIMEOUT}
 * @return the instance, if it was available within the timeout window
 */
export function waitPart<T extends BodyPart>(model: Model, part: T, timeoutS = DEFAULT_WAIT_TIMEOUT) {
	return waitBodyPartInstance(model, part, Enum.HumanoidRigType.R15, timeoutS);
}

/**
 * Awaits the instance associated with the given body
 * part within the passed model (character).
 *
 * This function will try to determine whether the passed
 * model is an R15 or R6 rig, if it cannot be
 * determined within the timeout, it will default to
 * selecting the R15 variant of the body part.
 *
 * @param model the character model
 * @param part the body part name
 * @param timeoutS the maximum amount of seconds to await the part for, default {@link DEFAULT_WAIT_TIMEOUT}
 * @return the instance, if it was available within the timeout window
 */
export function waitPartAuto<T extends BodyPart>(model: Model, part: T, timeoutS = DEFAULT_WAIT_TIMEOUT) {
	return waitBodyPartInstance(
		model,
		part,
		waitRigType(model, timeoutS) ?? Enum.HumanoidRigType.R15,
		timeoutS,
	);
}

/**
 * Awaits the instance associated with the given body
 * part within the passed model (character).
 *
 * The character model is assumed to be R6.
 *
 * @param model the R6 character model
 * @param part the body part name
 * @param timeoutS the maximum amount of seconds to await the part for, default {@link DEFAULT_WAIT_TIMEOUT}
 * @return the instance, if it was available within the timeout window
 *
 * @see {@link waitPart} for the R15 variant
 */
export function waitPartR6<T extends BodyPart>(model: Model, part: T, timeoutS = DEFAULT_WAIT_TIMEOUT) {
	return waitBodyPartInstance(model, part, Enum.HumanoidRigType.R6, timeoutS);
}

/**
 * Returns the `Humanoid` instance within
 * a model, if one is available.
 */
export function getHumanoid(model: Model) {
	return model.FindFirstChildWhichIsA('Humanoid');
}

/**
 * Awaits the `Humanoid` instance within a model.
 *
 * @param model the character model
 * @param timeoutS the maximum amount of seconds to wait for the humanoid, default {@link DEFAULT_WAIT_TIMEOUT}
 * @return the humanoid, if it was available within the timeout window
 */
export function waitHumanoid(model: Model, timeoutS = DEFAULT_WAIT_TIMEOUT) {
	const hum = model.WaitForChild('Humanoid', timeoutS);
	if (hum?.IsA('Humanoid')) return hum;
}
