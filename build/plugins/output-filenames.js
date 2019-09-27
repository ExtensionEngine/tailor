'use strict';

const logger = require('../../server/shared/logger');

const prefix = 'output-filenames-plugin:';

module.exports = (api, { pluginOptions }) => {
  const { normal = {}, vendor = {} } = pluginOptions.outputFilenames;
  // TODO: Figure out equivalent in Vue Cli
  // const defaultFilenames = api.config.output.fileNames;
  // normal = Object.assign({}, defaultFilenames, normal);
  // vendor = Object.assign({}, defaultFilenames, vendor);

  logger.debug(prefix, 'normal output filenames', normal);
  logger.debug(prefix, 'vendor output filenames', vendor);

  api.chainWebpack(webpackConfig => {
    setOutputFilename(webpackConfig.module.rule('fonts'), {
      normal: normal.font,
      vendor: vendor.font
    });
    setOutputFilename(webpackConfig.module.rule('svg'), {
      normal: normal.image,
      vendor: vendor.image
    });
  });
};

function setOutputFilename(rule, { normal, vendor } = {}) {
  const generic = rule.use('file-loader');
  const options = generic.get('options');

  rule.uses.store.clear();

  rule.oneOf('vendor')
    .include
      .add(filepath => /node_modules/.test(filepath))
      .end()
    .use(generic.name)
    .loader(generic.name)
    .options({ ...options, name: vendor || options.name });

  rule.oneOf('normal')
    .use(generic.name)
    .loader(generic.name)
    .options({ ...options, name: normal || options.name });
}
