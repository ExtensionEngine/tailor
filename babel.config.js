'use strict';

const babel = require('@babel/core');
const poiPresetCfg = babel.createConfigItem(require('poi/babel'), { type: 'preset' });
const babelOptions = { presets: [poiPresetCfg] };

module.exports = babelOptions;
