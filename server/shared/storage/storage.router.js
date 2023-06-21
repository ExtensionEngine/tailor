import { createError } from '../error/helpers.js';
import ctrl from './storage.controller.js';
import express from 'express';
import { FORBIDDEN } from 'http-status-codes';
import multer from 'multer';
import storage from '../../repository/storage.js';

const router = express.Router();
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

export default {
  path: '/assets',
  router
};
