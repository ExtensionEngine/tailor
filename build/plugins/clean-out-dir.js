'use strict';

exports.name = 'clean-out-dir';

exports.apply = (api, opts = {}) => {
  api.hook('createWebpackChain', config => {
    if (!api.isProd || !api.config.output.clean) return;
    const path = api.resolveOutDir();
    opts.root = opts.root || api.cwd;
    opts.verbose = Boolean(api.args.options.debug);
    config
      .plugin('clean-out-dir')
      .use(require.resolve('clean-webpack-plugin'), [path, opts]);
  });
};
