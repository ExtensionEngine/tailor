// TODO(marko): Default to local upload? Add other keys if necessary.
module.exports = {
  amazon: {
    key: process.env.STORAGE_KEY,
    secret: process.env.STORAGE_SECRET,
    region: process.env.STORAGE_REGION,
    bucket: process.env.STORAGE_BUCKET
  },
  local: {},
  provider: process.env.STORAGE_PROVIDER
};
