'use strict';

const { resolveStatics } = require('../shared/storage/helpers');
const { Revision, User } = require('../shared/database');

function index(req, res) {
  const courseId = req.params.courseId;
  return Revision
    .findAll({
      where: { courseId },
      include: [{ model: User, attributes: ['id', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: req.query.limit,
      offset: req.query.offset
    })
    .then(revisions => Promise.all(revisions.map(it => {
      if (it.entity !== 'TEACHING_ELEMENT') return it;
      return resolveStatics(it.state).then(state => {
        it.state = state;
        return it;
      });
    })))
    .then(data => res.json({ data }));
}

module.exports = {
  index
};
