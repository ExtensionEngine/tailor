'use strict';

const get = require('lodash/get');
const pull = require('lodash/pull');
const set = require('lodash/set');

// TODO: refactor + add entry expiration
class StorageService {
  constructor() {
    this.editors = {};
  }

  getKey(courseId, activityId) {
    return `c${courseId}a${activityId}`;
  }

  storeEditorId(editorId, courseId, activityId) {
    return this.getEditorIds(courseId, activityId)
      .then(editorIds => {
        if (!editorIds.includes(editorId)) editorIds.push(editorId);
        set(this.editors, this.getKey(courseId, activityId), editorIds);
      });
  }

  removeEditorId(editorId, courseId, activityId) {
    return this.getEditorIds(courseId, activityId)
      .then(editorIds => {
        if (editorIds.includes(editorId)) pull(editorIds, editorId);
      });
  }

  getEditorIds(courseId, activityId) {
    let editorIds = get(this.editors, this.getKey(courseId, activityId), []);
    return Promise.resolve(editorIds);
  }
}

module.exports = new StorageService();
