var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");
    HtmlWebpackPlugin = require("html-webpack-plugin");

var outPath = path.join(__dirname, 'dist');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './',
        filename: 'game.js',
    },
    devServer: {
      contentBase: path.join(__dirname, './'),
        compress: true,
        port: 3001,
        inline: true,
    }
};
