let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let path = require('path')

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {};

  /**
   * Resolve Path
   */
  config.resolve = {
    modules: [__dirname, 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  }

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = {
    main: './example/demo.ts'
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = {
    // Absolute output directory
    path: __dirname + '/../dist',

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: '/static/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  config.devtool = false


  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {loader: 'ts-loader'}
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.yaml/,
        use: [
          {loader: 'json-loader'},
          {loader: 'yaml-loader'}
        ]
      }
    ]
  }

  /**
   * Externals
   * Reference: https://webpack.github.io/docs/configuration.html#externals
   * Speed!
   */
  config.externals = {}

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [];

  config.plugins.push(
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: 'body'
    })
  )
  return config
}
