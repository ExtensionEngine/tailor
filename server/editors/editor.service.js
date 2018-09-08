'use strict';

const Editors = require('./editors');

// TODO: refactor + add entry expiration
class EditorService {
  constructor() {
    this.editors = new Map();
  }

  getKey(courseId, activityId) {
    return `${courseId}:${activityId}`;
  }

  addEditor(editor, courseId, activityId) {
    let key = this.getKey(courseId, activityId);
    let editors = this.get(key);

    editors.add(editor);
    this.editors.set(key, editors);
  }

  removeEditor(editor, courseId, activityId) {
    let editors = this.get(this.getKey(courseId, activityId));
    editors.delete(editor);
  }

  getEditors(courseId, activityId) {
    return this.get(this.getKey(courseId, activityId)).values();
  }

  get(key) {
    if (!this.editors.has(key)) return new Editors();
    return this.editors.get(key);
  }
}

module.exports = new EditorService();
