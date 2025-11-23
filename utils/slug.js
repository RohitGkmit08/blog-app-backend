const slugify = require('slugify');


const normalizeSlugInput = (value = '') => {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
};


const ensureUniqueSlug = async (Model, source, excludeId = null) => {
  const baseSlug = normalizeSlugInput(source);

  if (!baseSlug) {
    throw new Error('Unable to generate slug. Please provide a valid title.');
  }

  let candidate = baseSlug;
  let counter = 1;

  // Build query to check uniqueness
  const buildQuery = (slugValue) => {
    const query = { slug: slugValue };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return query;
  };

  // Keep checking until we find a unique slug
  while (await Model.exists(buildQuery(candidate))) {
    candidate = `${baseSlug}-${counter++}`;
  }

  return candidate;
};

module.exports = {
  ensureUniqueSlug,
  normalizeSlugInput,
};

