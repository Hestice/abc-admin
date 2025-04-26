export function capitalizeWords(str: string): string {
  if (!str) return str;

  return str
    .split(' ')
    .map((word) =>
      word
        .split('-')
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join('-')
    )
    .join(' ');
}
export function capitalizeFields<T extends Record<string, any>>(
  data: T,
  fieldsToCapitalize: string[]
): T {
  const result = { ...data } as Record<string, any>;

  fieldsToCapitalize.forEach((field) => {
    if (typeof result[field] === 'string' && result[field]) {
      result[field] = capitalizeWords(result[field]);
    }
  });

  return result as T;
}
