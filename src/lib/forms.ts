function arraysAreEqual(arr1: unknown[], arr2: unknown[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];

    if (JSON.stringify(item1) !== JSON.stringify(item2)) {
      return false;
    }
  }

  return true;
}

export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  updated: T
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in updated) {
    const originalValue = original[key];
    const updatedValue = updated[key];

    if (Array.isArray(updatedValue) && Array.isArray(originalValue)) {
      if (!arraysAreEqual(originalValue, updatedValue)) {
        changed[key] = updatedValue;
      }
    } else if (updatedValue !== originalValue) {
      changed[key] = updatedValue;
    }
  }

  return changed;
}
