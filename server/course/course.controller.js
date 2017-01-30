'use strict';

function index(req, res) {
  const user = req.user;
  return user.getCourses()
    .then(courses => res.json({ data: courses }));
};

module.exports = {
  index
};
