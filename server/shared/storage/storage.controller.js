const { getFileUrl, saveFile } = require('./');
const { ASSET_ROOT } = require('./helpers');
const crypto = require('crypto');
const path = require('path');

function getUrl(req, res) {
  const { origin, query: { key } } = req;
  return getFileUrl(key, { origin }).then(url => res.json({ url }));
}

function upload({ file }, res) {
  const extension = path.extname(file.originalname);
  const hash = crypto.createHash('md5').update(`${file}`).digest('hex');
  const key = `${ASSET_ROOT}/${hash}${extension}`;
  return saveFile(key, file.buffer, { ContentType: file.mimetype })
    .then(() => res.json({ key }));
}

module.exports = { getUrl, upload };
