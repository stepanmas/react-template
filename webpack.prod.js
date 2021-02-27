const path = require('path');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

function loadersStyles(loader) {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '/',
      },
    },
    loader,
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: [
          // eslint-disable-next-line global-require
          require('autoprefixer')(),
        ],
      },
    },
    'sass-loader',
  ];
}

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: './build',
    }),
    new UglifyJsPlugin({
      test: /\.\/build\/.+\.js($|\?)/i,
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        oneOf: [{
          resourceQuery: /^\?global/,
          use: loadersStyles('css-loader'),
        }, {
          use: loadersStyles({
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[hash:8]',
                context: path.resolve(__dirname, 'src'),
              },
              importLoaders: 1,
              localsConvention: 'camelCase',
            },
          }),
        }],
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
    ],
  },
});
