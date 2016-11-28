'use strict';
const courseModel = require('./courseModel').model;

class CourseController {
  constructor(model) {
    this.model = model;
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.replace = this.replace.bind(this);
    this.remove = this.remove.bind(this);
  }

  create(req, res, next) {
    this.model.create(req.body)
      .then(course => {
        res.location(`${req.originalUrl}/${course._key}`)
          .status(201)
          .json({ data: course });
      })
      .catch(next);
  }

  get(req, res, next) {
    this.model.get(req.params.courseKey)
      .then(course => res.status(200).json({ data: course }))
      .catch(next);
  }

  getAll(req, res, next) {
    this.model.getAll()
      .then(courses => res.status(200).json({ data: courses || [] }))
      .catch(next);
  }

  update(req, res, next) {
    this.model
      .update(req.params.courseKey, req.body)
      .then(course => res.status(200).json({ data: course }))
      .catch(next);
  }

  replace(req, res, next) {
    this.model
      .replace(req.params.courseKey, req.body)
      .then(course => res.status(200).json({ data: course }))
      .catch(next);
  }

  remove(req, res, next) {
    this.model
      .remove(req.params.courseKey)
      .then(course => res.status(200).json({ data: course }))
      .catch(next);
  }
}

module.exports = {
  Controller: CourseController,
  controller: new CourseController(courseModel)
};
