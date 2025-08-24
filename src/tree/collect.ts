/**
 * Collect instances that have a specified instance as a parent.
 *
 * @param root the instance to get children of
 * @param inclusive whether the root should be included as a child, default false
 * @return the children of the root
 */
export function collectChildren(root: Instance, inclusive = false) {
	return inclusive ? [root, ...root.GetChildren()] : root.GetChildren();
}

/**
 * Collect instances that have a specified instance as an ancestor.
 *
 * @param root the instance to get descendants of
 * @param inclusive whether the root should be included as a descendant, default false
 * @return the descendants of the root
 */
export function collectDescendants(root: Instance, inclusive = false) {
	return inclusive ? [root, ...root.GetDescendants()] : root.GetDescendants();
}

/**
 * Collects instances that share a parent with a specified instance.
 *
 * @param root the instance to get siblings of
 * @param inclusive whether the root should be included as a sibling, default true
 * @return the siblings of the root
 */
export function collectSiblings(root: Instance, inclusive = true) {
	const parent = root.Parent;
	if (!parent) return [];

	const siblings = parent.GetChildren();
	if (inclusive) return siblings;

	return parent.GetChildren().filter((v) => v !== root);
}

/**
 * Collect instances that have a specified instance as a descendant.
 *
 * @param root the instance to get ancestors of
 * @param inclusive whether the root should be included as an ancestor, default false
 * @return the ancestors of the root
 */
export function collectAncestors(root: Instance, inclusive = false) {
	const ancestors = [];
	let parent = root.Parent;

	if (inclusive) ancestors.push(root);
	while (parent && parent !== game) {
		ancestors.push(parent);
		parent = parent.Parent;
	}

	return ancestors;
}

/**
 * Accumulates the total combined mass of a specified instance.
 * This includes it's own mass and the mass of any descendants.
 *
 * @param root the instance to get the mass of
 * @return the accumulated mass of the root
 */
export function collectMass(root: Instance) {
	let mass = 0;

	for (const inst of collectDescendants(root, true)) {
		if (!inst.IsA('BasePart')) continue;
		mass += inst.Mass;
	}

	return mass;
}
