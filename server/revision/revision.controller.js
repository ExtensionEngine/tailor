'use strict';

const { Revision, User } = require('../shared/database');

function index(req, res) {
  const courseId = req.params.courseId;
  return Revision.findAll({
    where: { courseId },
    include: [{ model: User, as: 'user', attributes: ['id', 'email'] }],
    order: [['createdAt', 'DESC']],
    limit: req.query.limit,
    offset: req.query.offset
  })
  .then(data => res.json({ data }));
}

module.exports = { index };
