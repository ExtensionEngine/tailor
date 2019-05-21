'use strict';

const { writeFileSync } = require('fs');

exports.name = 'stats';

exports.cli = api => {
  api.command.option(
    '--print-stats',
    'Output webpack stats to `stats.json`',
    { default: false, type: [Boolean] }
  );
};

class StatsPlugin {
  constructor({ logger, path = 'stats.json' } = {}) {
    this.logger = logger;
    this.path = path;
  }

  apply(compiler) {
    compiler.hooks.done.tap('write-stats', stats => {
      this.logger.log('\nGenerating webpack stats file');
      writeFileSync(this.path, JSON.stringify(stats.toJson()), 'utf8');
      this.logger.done(`Location: ${this.path}`);
    });
  }
}

exports.apply = api => {
  api.hook('createWebpackChain', config => {
    if (!api.cli.options.printStats) return;
    const options = { logger: api.logger };
    config.plugin('generate-stats').use(StatsPlugin, [options]);
  });
};
