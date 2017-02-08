'use strict';

function index(req, res) {
  return res.json({ data: [1, 2, 3] });
}

module.exports = {
  index
};
