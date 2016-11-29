'use strict';

class BaseController {
  constructor(model, resourceKey) {
    this.model = model;
    this.resourceKey = resourceKey;

    this.create = this.create.bind(this);
    this.getByKey = this.getByKey.bind(this);
    this.updateByKey = this.updateByKey.bind(this);
    this.replaceByKey = this.replaceByKey.bind(this);
    this.removeByKey = this.removeByKey.bind(this);
    this.getMany = this.getMany.bind(this);
  }

  create(req, res, next) {
    this.model
      .create(req.body)
      .then(item => {
        res.location(`${req.originalUrl}/${item._key}`)
          .status(201)
          .json({ data: item });
      })
      .catch(next);
  }

  getByKey(req, res, next) {
    this.model
      .getByKey(req.params[this.resourceKey])
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  updateByKey(req, res, next) {
    this.model
      .updateByKey(req.params[this.resourceKey], req.body)
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  replaceByKey(req, res, next) {
    this.model
      .replaceByKey(req.params[this.resourceKey], req.body)
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  removeByKey(req, res, next) {
    this.model
      .removeByKey(req.params[this.resourceKey])
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  getMany(req, res, next) {
    this.model
      .getMany()
      .then(items => res.status(200).json({ data: items || [] }))
      .catch(next);
  }
}

module.exports = BaseController;
