const path = require("path")
const Dotenv = require("dotenv-webpack")

module.exports = {
  entry: ["babel-polyfill", "./client/index.js"],
  output: {
    path: path.join(__dirname, "client"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["@babel/env", "@babel/react"],
          plugins: ["@babel/proposal-class-properties"]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  target: "web",
  plugins: [
    new Dotenv({
      path: "./.env",
      systemvars: true
    })
  ],
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
}
