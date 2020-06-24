export function exists(value) {
  if (value === undefined || value === null) return false;
  return true;
}

export function notExists(value) {
  if (value === undefined || value === null) return true;
  return false;
}

export function isJson(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}