const express = require('express');
const opn = require('opn');
const path = require('path');
const proxyMiddleware = require('http-proxy-middleware');
const webpack = require('webpack');

const envSettings = require('../helpers/envSettings');
const settings = require('./settings');

if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(envSettings.dev.env.NODE_ENV);
const webpackConfig = process.env.NODE_ENV === envSettings.test.env.NODE_ENV
  ? require('../webpack/prod')
  : require('../webpack/dev');

const port = process.env.PORT || settings.client.PORT;
const proxyTable = envSettings.dev.proxyTable;

let app = express();
let compiler = webpack(webpackConfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
});

let hotMiddleware = require('webpack-hot-middleware')(compiler)
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options };
  }
  app.use(proxyMiddleware(context, options));
});

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
const staticPath = path.posix.join('/', 'static');
app.use(staticPath, express.static('./static'));

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  const uri = `http://localhost:${port}`;
  console.log(`Listening at ${uri}` + '\n');

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
