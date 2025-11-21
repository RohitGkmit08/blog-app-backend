const slugify = require("slugify");

const normalizeSlugInput = (value = "") =>
  slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

const ensureUniqueSlug = async (Model, source, excludeId) => {
  const baseSlug = normalizeSlugInput(source);

  if (!baseSlug) {
    throw new Error("Unable to generate slug. Please provide a valid title.");
  }

  let candidate = baseSlug;
  let counter = 1;

  const buildQuery = (slugValue) => {
    const query = { slug: slugValue };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return query;
  };

  while (await Model.exists(buildQuery(candidate))) {
    candidate = `${baseSlug}-${counter++}`;
  }

  return candidate;
};

module.exports = {
  ensureUniqueSlug,
  normalizeSlugInput,
};

