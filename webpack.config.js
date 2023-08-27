const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    content: "./src/content/index.js",
    worker: "./src/worker/index.js",
    popup: "./src/popup/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/popup/index.html",
      chunks: ['popup'],
      filename: "popup.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        type: 'asset/source',
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  optimization: {
    minimize: false
  },
}
