const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, 'client'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }]
  },
  target:'web',
  plugins: [
    new Dotenv({
      path: './.env',
      systemvars: true
    })
  ],
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
};
