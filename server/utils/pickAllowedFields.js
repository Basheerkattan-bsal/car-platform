exports.pickAllAllowedFields = (source, allowedFields) => {
  if (!source || typeof source !== 'object') {
    throw new TypeError('pickAllAllowedFields: must be an object');
  }
  if (!Array.isArray(allowedFields)) {
    throw new TypeError('pickAllAllowedFields must be ann array');
  }
  const filtered = {};

  allowedFields.forEach(field => {
    if (source[field] !== undefined) {
      filtered[field] = source[field];
    }
  });

  return filtered;
};
