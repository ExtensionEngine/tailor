const { getFileUrl, saveFile } = require('./');
const { ASSET_ROOT } = require('./helpers');
const crypto = require('crypto');
const path = require('path');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

function upload({ file }, res) {
  const extension = path.extname(file.originalname);
  const hash = crypto.createHash('sha256').update(`${file.buffer}`).digest('hex');
  const key = `${ASSET_ROOT}/${hash}${extension}`;
  return saveFile(key, file.buffer, { ContentType: file.mimetype })
    .then(() => res.json({ key }));
}

module.exports = { getUrl, upload };
