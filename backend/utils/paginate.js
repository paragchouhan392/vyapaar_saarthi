/**
 * paginateQuery utility
 * Applies skip / limit to a Mongoose query and returns pagination meta.
 *
 * @param {Object} model        - Mongoose model
 * @param {Object} filter       - Mongoose filter object (e.g. { userId })
 * @param {Object} queryParams  - req.query containing page / limit
 * @param {Object} [sort]       - Optional sort object, e.g. { createdAt: -1 }
 * @returns {{ docs, pagination }}
 */
const paginateQuery = async (model, filter = {}, queryParams = {}, sort = { createdAt: -1 }) => {
  const page  = Math.max(parseInt(queryParams.page)  || 1, 1);
  const limit = Math.min(parseInt(queryParams.limit) || 10, 100);
  const skip  = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    docs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { paginateQuery };
