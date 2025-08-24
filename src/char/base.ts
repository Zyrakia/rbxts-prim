import { EnumKey, typedLiteralFactory } from 'type-helpers';

type CharacterStructure = Omit<
	Record<EnumKey<typeof Enum.BodyPartR15>, { R15: string; R6?: string }>,
	'Unknown'
>;

/**
 * Maps R15 character parts to their R15 part name and the R6 equivalent, if one exists.
 *
 * For consistency, if a R6 equivalent exists, it will be mapped under the "Upper" version of the
 * R15 part. For example:
 * ```
 * | R15          | R6        |
 * |--------------|-----------|
 * | LeftUpperArm | Left Arm  |
 * | LeftLowerArm | undefined |
 * ```
 */
export const CharacterPartNames = typedLiteralFactory<CharacterStructure>()({
	Head: { R15: 'Head', R6: 'Head' },
	LeftFoot: { R15: 'LeftFoot' },
	LeftHand: { R15: 'LeftHand' },
	LeftLowerArm: { R15: 'LeftLowerArm' },
	LeftLowerLeg: { R15: 'LeftLowerLeg' },
	LeftUpperArm: { R15: 'LeftUpperArm', R6: 'Left Arm' },
	LeftUpperLeg: { R15: 'LeftUpperLeg', R6: 'Left Leg' },
	LowerTorso: { R15: 'LowerTorso' },
	RightFoot: { R15: 'RightFoot' },
	RightHand: { R15: 'RightHand' },
	RightLowerArm: { R15: 'RightLowerArm' },
	RightLowerLeg: { R15: 'RightLowerLeg' },
	RightUpperArm: { R15: 'RightUpperArm', R6: 'Right Arm' },
	RightUpperLeg: { R15: 'RightUpperLeg', R6: 'Right Leg' },
	RootPart: { R15: 'HumanoidRootPart', R6: 'HumanoidRootPart' },
	UpperTorso: { R15: 'UpperTorso', R6: 'Torso' },
} as const);

/**
 * Retrieves the character model of a specified player.
 *
 * This function blocks until the character is retrieved or spawned.
 *
 * @param player the player to get the character of
 * @return the character model of the player
 */
export function get(player: Player) {
	return player.Character ?? player.CharacterAdded.Wait()[0];
}

/**
 * Asynchronously retrieves the character model of a specified player.
 *
 * The resulting promise will only resolve when the character is retrieved or spawned.
 *
 * @param player the player to get the character of
 * @return a promise that resolves with the character model of the player
 */
export function getAsync(player: Player) {
	return player.Character ? Promise.resolve(player.Character) : Promise.fromEvent(player.CharacterAdded);
}

export function getHum(charOrPlayer: Model) {}

function getPartName(char: Model, part: keyof typeof CharacterPartNames) {}

/**
 * Retrieves a specified part of a specified character model.
 *
 * @param char the character to get the part from
 * @param part the name of the part to retrieve
 * @return the part, if one is found within the character
 */
export function getPart(char: Model, part: keyof typeof CharacterPartNames) {}

export function waitPart(char: Model, part: keyof typeof CharacterPartNames) {}

export function teleport(char: Model, location: Vector3 | CFrame | BasePart) {}

export function unequip(char: Model | Humanoid) {}
