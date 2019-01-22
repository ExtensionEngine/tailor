const crypto = require('crypto');
const path = require('path');
const { saveFile, getFileUrl } = require('../shared/storage');

function uploadFile(req, res) {
  const { file } = req;
  const extension = path.extname(file.originalname);
  const hash = crypto.createHash('md5').update(`${file}`).digest('hex');
  const key = `repository/assets/${hash}${extension}`;
  return saveFile(key, req.file.buffer, { ContentType: file.mimetype }).then(({ $response }) => {
    return res.json({ key, error: $response.error });
  });
}

function getDownloadUrl({ query }, res) {
  const { url } = query;
  return getFileUrl(url).then(downloadUrl => res.json(downloadUrl));
}

module.exports = { uploadFile, getDownloadUrl };
