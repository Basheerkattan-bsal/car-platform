/**
 * Parse a number from unknown input (query params)
 * Returns null when:
 * Value is undefined (null / empty string)
 * Value is not a finite number
 */

export const parseNum = v => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (s === '') return null; // !important : This avoids Number('') -> 0

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

/**
 * Parse an integer with min/max clamping
 * Returns defaultVa,lue if invalid
 */

export const parseInClamped = (
  v,
  { min = 1, max = 50, defaultValue = 10 } = {}
) => {
  const raw = parseNum(v);
  if (raw === null) return defaultValue;

  const intVal = Math.trunc(raw);
  if (!Number.isFinite(intVal)) return defaultValue;

  return Math.min(Math.max(intVal, min), max);
};

/**
 * Parse a string safely by trim and allowlist
 */

/* export const parseStr = (v, { allowed = null, defaultValue = null } = {}) => {
  if (v === undefined || v === null) return defaultValue;

  const s = String(v).trim();
  if (s === '') return defaultValue;

  if (Array.isArray(allowed) && !allowed.includes(s)) return defaultValue;

  return s;
};
 */

/**
 * Function for range filter $gte/$lte only when bound exist.
 */

export const rangeFilter = (min, max) => {
  const out = {};
  if (min !== null) out.$gte = min;
  if (max !== null) out.$lte = max;

  return Object.keys(out).length ? out : null;
};

/**
 * Parse boolean from query strings
 * Accepts true/false,1/0 'true'/'false', '1',/'0'
 */
export const parseBool = (v, { defaultValue = null }, {}) => {
  if (!isPresent(v)) return defaultValue;

  if (typeof v === 'boolean') return v;

  const s = String(v).trim().toLowerCase();

  if (s === 'true' || s === '1') return true;
  if (s === 'false' || s === '0') return false;

  return defaultValue;
};

/**
 * Pagination helper
 * Clamps pages/limit
 * return skip for mongo
 */

export const parsePagination = (
  query,
  { defaultPage = 1, defaultLimit = 10, maxLimit = 50 } = {}
) => {
  const page = parseInClamped(query.page, {
    min: 1,
    max: 1_000_000,
    defaultValue: defaultPage,
  });
  const limit = parseInClamped(query.limit, {
    min: 1,
    max: maxLimit,
    defaultValue: defaultLimit,
  });
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
