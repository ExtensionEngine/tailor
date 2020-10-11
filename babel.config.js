'use strict';

/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  presets: [
    // TODO: remove this when https://github.com/egoist/poi/pull/761 gets merged!
    require('proxyquire')('poi/lib/babel/preset', {
      'react-refresh/babel': () => ({})
    })
  ]
};
