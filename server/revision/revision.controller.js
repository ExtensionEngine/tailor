const { resolveStatics } = require('../shared/storage/helpers');
const { Revision, User } = require('../shared/database');

function index(req, res) {
  const courseId = req.params.courseId;
  const { limit, offset, entityId } = req.query;
  const where = entityId ? { courseId, state: { id: entityId } } : { courseId };
  return Revision
    .findAll({
      where,
      include: [{ model: User, attributes: ['id', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    })
    .then(data => res.json(data));
}

function resolve(req, res) {
  const { courseId, revId } = req.params;
  return Revision
    .findOne({
      where: { courseId, id: revId },
      include: [{ model: User, attributes: ['id', 'email'] }]
    })
    .then(revision => {
      if (revision.entity !== 'TEACHING_ELEMENT') return revision;
      return resolveStatics(revision.state).then(state => {
        revision.state = state;
        return revision;
      });
    })
    .then(data => res.json(data));
}

module.exports = {
  index,
  resolve
};
