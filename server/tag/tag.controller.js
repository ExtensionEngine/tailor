import db from '../shared/database/index.js';
import { NO_CONTENT } from 'http-status-codes';
import pick from 'lodash/pick.js';
import yn from 'yn';

const { Tag } = db;

async function list({ user, query: { associated } }, res) {
  const tags = await (yn(associated)
    ? Tag.getAssociated(user)
    : Tag.findAll());
  return res.json({ data: tags });
}

async function get({ tag }, res) {
  return res.json({ data: tag });
}

function create({ body }, res) {
  const attrs = ['name', 'isAccessTag'];
  const payload = pick(body, attrs);
  return Tag.create(payload)
    .then(data => res.json({ data }));
}

function patch({ tag, body }, res) {
  const attrs = ['name', 'isAccessTag'];
  const payload = pick(body, attrs);
  return tag.update(payload)
    .then(tag => tag.reload())
    .then(data => res.json({ data }));
}

function remove({ tag }, res) {
  return tag.destroy()
    .then(data => res.status(NO_CONTENT).end());
}

export default {
  list,
  get,
  create,
  patch,
  remove
};
