'use strict';

const get = require('lodash/get');
const set = require('lodash/set');
const PromiseQueue = require('promise-queue');

// TODO: refactor + add entry expiration
class StorageService {
  constructor() {
    this.queue = new PromiseQueue(1, Infinity);
    const editors = {};
    this.addEditor = function (editorId, courseId, activityId) {
      if (!get(editors, [courseId, activityId])) {
        set(editors, [courseId, activityId], []);
      }
      let activityEditorIds = get(editors, [courseId, activityId]);
      if (!activityEditorIds.includes(editorId)) activityEditorIds.push(editorId);
    };
    this.removeEditor = function (editorId, courseId, activityId) {
      let activityEditorIds = get(editors, [courseId, activityId]) || [];
      if (activityEditorIds.includes(editorId)) {
        let index = activityEditorIds.indexOf(editorId);
        if (index > -1) activityEditorIds.splice(index, 1);
        set(editors, [courseId, activityId], activityEditorIds);
      }
    };
    this.getEditors = function (courseId, activityId) {
      return get(editors, [courseId, activityId]) || [];
    };
  }

  storeEditorId(editorId, courseId, activityId) {
    return this.queue.add(() => Promise.resolve(
      this.addEditor(editorId, '' + courseId, '' + activityId)
    ));
  }

  removeEditorId(editorId, courseId, activityId) {
    return this.queue.add(() => Promise.resolve(
      this.removeEditor(editorId, '' + courseId, '' + activityId)
    ));
  }

  getEditorIds(courseId, activityId) {
    return this.queue.add(() => Promise.resolve(
      this.getEditors('' + courseId, '' + activityId)
    ));
  }
}

module.exports = new StorageService();
