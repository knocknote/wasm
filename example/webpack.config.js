const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './module_loader.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'module_loader.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'index.html' },
      { from: 'hello*.{wasm,js}' }
    ]),
  ],

  devServer: {
    contentBase: 'dist',
    disableHostCheck: true,
    inline: true,
    historyApiFallback: true,
    compress: true
  },

  node: {
    fs: 'empty'
  }

};
