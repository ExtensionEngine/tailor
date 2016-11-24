const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('../../client/config');
const utils = require('../../client/build/utils');
const projectRoot = require('../helpers/projectRoot');

const distPath = projectRoot('dist');
const assetsPublicPath = '/';
const useCssSourceMap = true;

module.exports = {
  devtool: '#eval-source-map',
  entry: ['./client/build/dev-client', './client/main.js'],
  output: {
    path: distPath,
    publicPath: assetsPublicPath,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: projectRoot('node_modules'),
    alias: {
      vue$: 'vue/dist/vue.common.js',
      src: projectRoot('client', 'src'),
      assets: projectRoot('client', 'src', 'assets'),
      components: projectRoot('client', 'src', 'components'),
    },
  },
  resolveLoader: {
    fallback: projectRoot('node_modules'),
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot(),
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot(),
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot(),
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
    ],
  },
  eslint: {
    formatter: require('eslint-friendly-formatter'),
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions'],
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
  ],
};
