const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
  entry: ['babel-polyfill', './client/index.js'],
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
        presets: ["@babel/env", "@babel/react"],
        plugins: ["@babel/proposal-class-properties"]
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
    }),
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
};
