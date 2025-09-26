import { getPartAuto, waitPartAuto, type DEFAULT_WAIT_TIMEOUT } from './base';

/**
 * A union of the default Roblox character sound names.
 */
export type CharacterSound =
	| 'Climbing'
	| 'Died'
	| 'FreeFalling'
	| 'GettingUp'
	| 'Jumping'
	| 'Landing'
	| 'Running'
	| 'Splash'
	| 'Swimming';

type SoundSubject = Model | BasePart | Humanoid;

/**
 * Attempts to resolve a subject into a `RootPart`.
 */
function resolveRoot(subject: SoundSubject) {
	return subject.IsA('BasePart')
		? subject
		: subject.IsA('Humanoid')
		? subject.RootPart
		: getPartAuto(subject, 'RootPart');
}

/**
 * Attempts to resolve a subject into a `RootPart`,
 * within the given timeout.
 */
function waitResolveRoot(subject: SoundSubject, timeoutS: number) {
	return subject.IsA('BasePart')
		? subject
		: subject.IsA('Humanoid')
		? subject.RootPart
		: waitPartAuto(subject, 'RootPart', timeoutS);
}

/**
 * Retrieves the default character sound instance
 * from a subject.
 *
 * @param subject either a character model, `HumanoidRootPart` or `Humanoid`
 * @param soundName the character sound instance to retrieve
 * @return the sound instance, if it could be located
 */
export function getSound(subject: SoundSubject, soundName: CharacterSound) {
	const root = resolveRoot(subject);
	if (!root) return;

	const sound = root.FindFirstChild(soundName);
	if (sound?.IsA('Sound')) return sound;
}

/**
 * Waits for the default character sound instance
 * from a subject.
 *
 * @param subject either a character model, `HumanoidRootPart` or `Humanoid`
 * @param soundName the character sound instance to retrieve
 * @param timeoutS the maximum time that the sound instance will be waited for, default {@link DEFAULT_WAIT_TIMEOUT}
 * @return the sound instance, if it could be located
 */
export function waitSound(subject: SoundSubject, soundName: CharacterSound, timeoutS: number) {
	const root = waitResolveRoot(subject, timeoutS);
	if (!root) return;

	const sound = root.WaitForChild(soundName, timeoutS);
	if (sound?.IsA('Sound')) return sound;
}
