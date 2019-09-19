const path = require('path');

module.exports = {
  entry: './js/dev/index.js',
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'js/public')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  mode: 'production'
};