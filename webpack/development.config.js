let webpack = require('webpack')
let fs = require('fs')
let path = require('path')
let devServerConfig = require('./common.config.js')()

devServerConfig.cache = true;
devServerConfig.devtool = 'inline-source-map';
// devServerConfig.devtool = 'cheap-eval-source-map';

devServerConfig.plugins.push(
  // Reference: https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"development"',
    DEBUG: true
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.LoaderOptionsPlugin({
    debug: true
  })
)

const PORT = '5000'
devServerConfig.output.publicPath = `http://localhost:${PORT}/static/`

devServerConfig.devServer = {
  contentBase: path.join(__dirname, '..', 'dist'),
  historyApiFallback: {
    index: '/static/index.html'
  },
  stats: {
    modules: false,
    cached: false,
    colors: true,
    chunk: false
  },
  host: '0.0.0.0',
  port: PORT
}

module.exports = devServerConfig;