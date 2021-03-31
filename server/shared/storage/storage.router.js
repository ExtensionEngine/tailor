'use strict';

const { createError } = require('../error/helpers');
const ctrl = require('./storage.controller');
const { FORBIDDEN } = require('http-status-codes');
const multer = require('multer');
const router = require('express').Router();
const storage = require('../../repository/storage');

const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/', validateAssetRepository, ctrl.getUrl)
  .post('/', upload.single('file'), ctrl.upload);

function validateAssetRepository(req, res, next) {
  const { repository, query: { key } } = req;
  const repositoryAssetsPath = storage.getPath(repository.id);
  if (!key.startsWith(repositoryAssetsPath)) {
    return createError(FORBIDDEN, 'Access restricted');
  }
  next();
}

module.exports = {
  path: '/assets',
  router
};
