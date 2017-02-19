var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");
    HtmlWebpackPlugin = require("html-webpack-plugin");

var outPath = path.join(__dirname, 'dist');

module.exports = {
    entry: './src/test_cognifit.js',
    output: {
        path: './dist',
        filename: 'game.js',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        inline: true,
    }
};
