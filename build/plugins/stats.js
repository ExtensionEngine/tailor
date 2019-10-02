'use strict';

const { writeFileSync } = require('fs');
const logger = require('../../server/shared/logger');

class StatsPlugin {
  constructor({ logger, path = 'stats.json' } = {}) {
    this.logger = logger;
    this.path = path;
  }

  apply(compiler) {
    compiler.hooks.done.tap('write-stats', stats => {
      this.logger.debug('\nGenerating webpack stats file');
      writeFileSync(this.path, JSON.stringify(stats.toJson()), 'utf8');
      this.logger.debug(`Location: ${this.path}`);
    });
  }
}

module.exports = api => {
  const { build } = api.service.commands;

  const buildFn = build.fn;

  build.fn = (...args) => {
    if (args[0].stats) {
      api.chainWebpack(webpackConfig => {
        const options = { logger };
        webpackConfig.plugin('generate-stats').use(StatsPlugin, [options]);
      });
    }
    return buildFn(...args);
  };
};
