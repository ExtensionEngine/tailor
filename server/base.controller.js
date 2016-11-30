'use strict';

class BaseController {
  constructor(model, resourceKey) {
    this.model = model;
    this.resourceKey = resourceKey;

    this.create = this.create.bind(this);
    this.show = this.show.bind(this);
    this.patch = this.patch.bind(this);
    this.replace = this.replace.bind(this);
    this.remove = this.remove.bind(this);
    this.list = this.list.bind(this);
  }

  create(req, res, next) {
    this.model
      .create(req.body)
      .then(data => {
        res.location(`${req.originalUrl}/${data._key}`)
          .status(201)
          .json({ data });
      })
      .catch(next);
  }

  show(req, res, next) {
    this.model
      .getByKey(req.params[this.resourceKey])
      .then(data => res.status(200).json({ data }))
      .catch(next);
  }

  patch(req, res, next) {
    this.model
      .updateByKey(req.params[this.resourceKey], req.body)
      .then(data => res.status(200).json({ data }))
      .catch(next);
  }

  replace(req, res, next) {
    this.model
      .replaceByKey(req.params[this.resourceKey], req.body)
      .then(data => res.status(200).json({ data }))
      .catch(next);
  }

  remove(req, res, next) {
    this.model
      .removeByKey(req.params[this.resourceKey])
      .then(data => res.status(200).json({ data }))
      .catch(next);
  }

  list(req, res, next) {
    this.model
      .getMany()
      .then(data => res.status(200).json({ data }))
      .catch(next);
  }
}

module.exports = BaseController;
