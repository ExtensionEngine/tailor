module.exports = {
  pagination: {
    page: process.env.CURRENT_PAGE || 1,
    limit: process.env.ITEMS_PER_PAGE || 20
  },
  sort: {
    field: 'id',
    order: {
      ASC: 'ASC',
      DESC: 'DESC'
    }
  }
};
