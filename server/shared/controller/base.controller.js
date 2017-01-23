'use strict';

const io = require('../io');

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
    this.listFiltered = this.listFiltered.bind(this);
  }

  create(req, res, next) {
    this.model
      .create(req.body)
      .then(data => {
        io.setCreated(res, data);
        next();
      })
      .catch(next);
  }

  show(req, res, next) {
    this.model
      .getByKey(req.params[this.resourceKey])
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  patch(req, res, next) {
    this.model
      .updateByKey(req.params[this.resourceKey], req.body)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  replace(req, res, next) {
    this.model
      .replaceByKey(req.params[this.resourceKey], req.body)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.model
      .removeByKey(req.params[this.resourceKey])
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  list(req, res, next) {
    this.model
      .getMany()
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }

  listFiltered(req, res, next) {
    const search = io.locals.load(req, 'searchTerms');
    const pagination = io.locals.load(req, 'pagination');
    const sort = io.locals.load(req, 'sort');

    this.model
      .getFiltered(search, pagination, sort)
      .then(data => {
        io.setOK(res, data);
        next();
      })
      .catch(next);
  }
}

module.exports = BaseController;
