const crypto = require('crypto');

const DEFAULT_IMAGE_EXTENSION = 'png';

function extractFileAsset(asset) {
  const image = asset.data.url;
  const base64Pattern = /^data:image\/(\w+);base64,/;
  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  const extension = image.match(base64Pattern)[1] || DEFAULT_IMAGE_EXTENSION;
  const hashString = `${asset.id}${file}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex');
  const key = `/course/${asset.courseId}/asset/${asset.id}/${hash}.${extension}`;
  return { key, file };
};

module.exports = {
  extractFileAsset
};
