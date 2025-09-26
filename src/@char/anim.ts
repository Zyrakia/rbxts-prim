import { getHumanoid, waitHumanoid, type DEFAULT_WAIT_TIMEOUT } from './base';

type AnimatorSubject = Model | Humanoid;

type DefaultR15State =
	| 'idle'
	| 'walk'
	| 'run'
	| 'swim'
	| 'swimidle'
	| 'jump'
	| 'fall'
	| 'climb'
	| 'sit'
	| 'toolnone'
	| 'toolslash'
	| 'toollungle'
	| 'wave'
	| 'point'
	| 'dance'
	| 'dance2'
	| 'dance3'
	| 'laugh'
	| 'cheer';

/**
 * Attempts to resolve a subject into a `Humanoid`.
 */
function resolveHum(subject: AnimatorSubject) {
	return subject.IsA('Humanoid') ? subject : getHumanoid(subject);
}

/**
 * Attempts to resolve a subject into a `Humanoid`,
 * within the given timeout.
 */
function waitResolveHum(subject: AnimatorSubject, timeoutS?: number) {
	return subject.IsA('Humanoid') ? subject : waitHumanoid(subject, timeoutS);
}

/**
 * Attempts to retrieve the animator of a subject.
 *
 * @param subject either a character model or `Humanoid`
 * @return the animator within the subject, if available
 */
export function getAnimator(subject: AnimatorSubject) {
	const hum = resolveHum(subject);
	if (!hum) return;

	return hum.FindFirstChildWhichIsA('Animator');
}

/**
 * Attempts to retrieve the animator of a subject.
 *
 * @param subject either a character model or `Humanoid`
 * @param timeoutS the maximum time that the animator instance will be waited for, default {@link DEFAULT_WAIT_TIMEOUT}
 * @return the animator within the subject, if available
 */
export function waitAnimator(subject: AnimatorSubject, timeoutS?: number) {
	const hum = waitResolveHum(subject, timeoutS);
	if (!hum) return;

	const animator = hum.WaitForChild('Animator');
	if (animator.IsA('Animator')) return animator;
}

/**
 * Returns the default Roblox animation script within
 * a player character model.
 *
 * @param char the character model
 * @return the animation script, if available
 */
export function getAnimationScript(char: Model) {
	const animScript = char.FindFirstChild('Animate');
	if (animScript?.IsA('LocalScript')) return animScript;
}

/**
 * Searches through the character's animation script and find the
 * animation instances associated with the given character state.
 *
 * @param char the character model
 * @param state the state name to search for animations under
 * @returns the animation instances, if any were found
 */
export function getAnimationsForState(char: Model, state: DefaultR15State | ({} & string)) {
	const animScript = getAnimationScript(char);
	if (!animScript) return;

	const container = animScript.FindFirstChild(state);
	if (!container?.IsA('StringValue')) return;

	const animations = container.GetChildren().filter((v): v is Animation => v.IsA('Animation'));
	if (!animations.isEmpty()) return animations;
}
