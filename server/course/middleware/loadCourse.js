'use strict';

const locals = require('../../shared/io').locals;

function loadCourse(courseModel) {
  return (req, res, next) => {
    courseModel
      .getByKey(req.params.courseKey)
      .then(course => {
        locals.save(req, 'course', course);
        next();
      })
      .catch(next);
  };
}

module.exports = loadCourse;
