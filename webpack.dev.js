const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

const devTemplate = 'index.html';

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        oneOf: [{
          resourceQuery: /^\?global/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        }, {
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  exportLocalsConvention: 'camelCase',
                  localIdentName: '[name]-[local]-[hash:4]',
                },
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
        }],
      },
    ],
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    contentBase: './build',
    hot: true,
    historyApiFallback: {
      index: devTemplate,
      rewrites: [
        {
          from: /^\/.+\/$/,
          to: `/${devTemplate}`,
        },
      ],
    },
    open: true,
    index: devTemplate,
  },
});
