import ctrl from './tag.controller.js';
import express from 'express';

const router = express.Router();

router
  .get('/', ctrl.list);

export default {
  path: '/tags',
  router
};
