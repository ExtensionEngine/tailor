'use strict';

exports.name = 'clean-out-dir';

exports.cli = api => {
  api.command.option(
    '--print-stats',
    'Output webpack stats to `stats.json`',
    { default: false, type: [Boolean] }
  );
};

exports.apply = (api, opts = {}) => {
  const statsConfig = Object.assign({ fields: null }, opts);
  api.hook('createWebpackChain', config => {
    if (!api.cli.options.printStats) return;
    const { StatsWriterPlugin } = require('webpack-stats-plugin');
    config
      .plugin('stats')
      .use(StatsWriterPlugin, [statsConfig]);
  });
};
