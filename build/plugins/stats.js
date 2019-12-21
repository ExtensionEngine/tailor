'use strict';

const { writeFileSync } = require('fs');

exports.name = 'stats';

/**
 * @param {import('poi')} api
 */
exports.cli = api => {
  api.command.option(
    '--print-stats',
    'Output webpack stats to `stats.json`',
    { default: false, type: [Boolean] }
  );
};

class StatsPlugin {
  constructor({ logger, ...options } = {}) {
    options.path = options.path || 'stats.json';
    options.stats = options.stats || {};
    this.logger = logger;
    this.options = options;
  }

  /**
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.done.tap('write-stats', stats => {
      this.logger.log('\nGenerating webpack stats file');
      const data = stats.toJson(this.options.stats);
      const contents = JSON.stringify(data, (key, value) => {
        if (key !== 'source') return value;
      }, 2);
      writeFileSync(this.options.path, contents, 'utf8');
      this.logger.done(`Location: ${this.options.path}`);
    });
  }
}

/**
 * @param {import('poi')} api
 * @param {Object} options
 * @param {String} options.path
 * @param {import('webpack').Stats.ToJsonOptions} options.stats
 */
exports.apply = (api, options = {}) => {
  api.hook('createWebpackChain', config => {
    if (!api.cli.options.printStats) return;
    options.logger = api.logger;
    config.plugin('generate-stats').use(StatsPlugin, [options]);
  });
};
