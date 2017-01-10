module.exports = {
  pagination: {
    page: process.env.CURRENT_PAGE || 1,
    limit: process.env.ITEMS_PER_PAGE || 20
  },
  sort: {
    field: '_key',
    order: {
      ASC: 'ASC',
      DESC: 'DESC'
    }
  }
};
