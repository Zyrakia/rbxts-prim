/**
 * Fetches the first child of a specified instance that is of a specified type.
 * If one does not exist, it is created.
 *
 * @param root the instance to ensure the child of
 * @param className the class type of the instance to ensure
 * @param name the name that the child must have, optional
 * @return the found or created child of the given type
 */
export function ensureChild<T extends keyof CreatableInstances>(root: Instance, className: T, name?: string) {
	let found;
	if (name === undefined) found = root.FindFirstChildOfClass(className);
	else found = root.GetChildren().find((v) => v.IsA(className) && v.Name === name);

	if (found) return found;

	const created = new Instance(className, root);
	if (name === undefined) return created;

	created.Name = name;
	return created;
}
