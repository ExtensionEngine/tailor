const crypto = require('crypto');
const path = require('path');
const { saveFile } = require('../shared/storage');

function uploadFile(req, res) {
  const { file } = req;
  const extension = path.extname(file.originalname);
  const hash = crypto.createHash('md5').update(`${file}`).digest('hex');
  const key = `repository/assets/${hash}${extension}`;
  return saveFile(key, req.file.buffer).then(({ $response }) => {
    return res.json({ key, error: $response.error });
  });
}

module.exports = { uploadFile };
