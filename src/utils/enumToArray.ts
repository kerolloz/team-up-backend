export function enumToArray(enumObject: any): string[] {
  const keys = Object.keys(enumObject).filter(
    key => typeof enumObject[key as any] === 'number'
  );
  return keys;
}
