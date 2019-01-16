const { saveFile } = require('../shared/storage');

function uploadFile(req, res) {
  const key = `repository/assets/someAsset`;
  return saveFile(key, req.file.buffer).then(result => {
    return res.json({ result });
  });
}

module.exports = { uploadFile };
