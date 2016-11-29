'use strict';

class BaseController {
  constructor(model, resourceName) {
    this.model = model;
    this.resourceName = resourceName;
    this.resourceKey = `${resourceName}Key`;

    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.update = this.update.bind(this);
    this.replace = this.replace.bind(this);
    this.remove = this.remove.bind(this);
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

  get(req, res, next) {
    this.model
      .get(req.params[this.resourceKey])
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  getAll(req, res, next) {
    this.model
      .getAll()
      .then(items => res.status(200).json({ data: items || [] }))
      .catch(next);
  }

  update(req, res, next) {
    this.model
      .update(req.params[this.resourceKey], req.body)
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  replace(req, res, next) {
    this.model
      .replace(req.params[this.resourceKey], req.body)
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }

  remove(req, res, next) {
    this.model
      .remove(req.params[this.resourceKey])
      .then(item => res.status(200).json({ data: item }))
      .catch(next);
  }
}

module.exports = BaseController;
