'use strict';

exports.name = 'output-filenames';

const prefix = `${exports.name}-plugin:`;

exports.apply = (api, { normal, vendor } = {}) => {
  const defaultFilenames = api.config.output.fileNames;
  normal = Object.assign({}, defaultFilenames, normal);
  vendor = Object.assign({}, defaultFilenames, vendor);

  api.logger.debug(prefix, 'normal output filenames', normal);
  api.logger.debug(prefix, 'vendor output filenames', vendor);

  api.hook('createWebpackChain', config => {
    setOutputFilename(config.module.rule('font'), {
      normal: normal.font,
      vendor: vendor.font
    });
    setOutputFilename(config.module.rule('svg'), {
      normal: normal.image,
      vendor: vendor.image
    });
  });
};

function setOutputFilename(rule, { normal, vendor } = {}) {
  const generic = rule.use('file-loader');
  const loader = generic.get('loader');
  const options = generic.get('options');

  rule.uses.store.clear();

  rule.oneOf('vendor')
    .include
      .add(filepath => /node_modules/.test(filepath))
      .end()
    .use(generic.name)
    .loader(loader)
    .options({ ...options, name: vendor || options.name });

  rule.oneOf('normal')
    .use(generic.name)
    .loader(loader)
    .options({ ...options, name: normal || options.name });
}
