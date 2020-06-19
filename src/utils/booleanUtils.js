export function exists(value) {
  if (value === undefined || value === null) return false;
  return true;
}

export function notExists(value) {
  if (value === undefined || value === null) return true;
  return false;
}