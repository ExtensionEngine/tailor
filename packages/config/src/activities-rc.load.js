'use strict';

module.exports = require('./utils/configLoader')('tailor', {
  flag: 'config',
  envVar: 'TAILOR_CONFIG'
});
