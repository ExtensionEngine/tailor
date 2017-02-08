'use strict';

const { Revision, User } = require('../shared/database/sequelize');

function index(req, res) {
  const courseId = req.params.courseId;
  return Revision
    .findAll({
      where: { courseId },
      include: [User],
      order: [['createdAt', 'DESC']]
    })
    .then(data => res.json({ data }));
}

module.exports = {
  index
};
