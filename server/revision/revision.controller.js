'use strict';

const { Revision, User } = require('../shared/database');

function index(req, res) {
  const courseId = req.params.courseId;
  return Revision
    .findAll({
      where: { courseId },
      include: [{ model: User, attributes: ['id', 'email'] }],
      order: [['createdAt', 'DESC']]
    })
    .then(data => res.json({ data }));
}

module.exports = {
  index
};
