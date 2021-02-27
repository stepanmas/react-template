const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
  name: __dirname,
  entry: [
    'react-hot-loader/patch',
    './src/entry.tsx',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[hash].js',
    publicPath: '/',
  },
  performance: {
    maxEntrypointSize: 1 * 1024 * 1024,
    maxAssetSize: 1 * 1024 * 1024,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    plugins: [
      new TsConfigPathsPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './public/index.html'),
      minify: {
        removeScriptTypeAttributes: true,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        /* {
          from: './src/images',
          to: './images',
        }, */
        {
          from: './src/lang',
          to: './lang/',
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-syntax-dynamic-import',
            ],
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } },
              ],
              '@babel/react',
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.(ico|gif|png|jpe?g)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: './src/images',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff2?|svg)$/,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
              name: './fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: [
          path.resolve(__dirname, 'src/components'),
        ],
        use: ['html-loader'],
      },
    ],
  },
};
