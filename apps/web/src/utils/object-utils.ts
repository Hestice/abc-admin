/**
 * Performs a deep equality check between two values.
 * Works with primitive values, objects, arrays, dates, and nested structures.
 */
export function deepEquals(a: any, b: any): boolean {
  // Check if same reference or both null/undefined
  if (a === b) return true;

  // If either is null/undefined but not both
  if (a == null || b == null) return false;

  // Compare dates
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle different types
  if (typeof a !== typeof b) return false;

  // For non-object types, we've already checked with === above
  if (typeof a !== 'object') return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEquals(val, b[idx]));
  }

  // Handle case where one is array and one is not
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Compare objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) => keysB.includes(key) && deepEquals(a[key], b[key])
  );
}
