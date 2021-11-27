const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env) => {
  const mode = env.prod ? 'production' : 'development';
  const isDev = Boolean(env.dev);
  const BUILD_DATE = new Date().toISOString();
  return {
    cache: isDev,
    devtool: isDev ? 'source-map' : false,
    entry: [
      './src/entry.tsx',
    ],
    mode,
    name: __dirname,
    optimization: {
      runtimeChunk: true,
      minimize: !isDev,
      minimizer: [new TerserPlugin()],
    },
    output: {
      filename: isDev ? '[name].js' : '[name]-[contenthash].bundle.js',
      path: path.resolve(__dirname, 'build'),
      pathinfo: false,
      publicPath: '/',
    },
    target: 'web',
    performance: {
      hints: false,
      maxEntrypointSize: 1 * 1024 * 1024, // 1 mb
      maxAssetSize: 1 * 1024 * 1024,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      fallback: { path: false },
      symlinks: false,
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
      plugins: [
        // ..
      ],
    },
    resolveLoader: {
      modules: [path.join(__dirname, 'node_modules')],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, './public/index.html'),
        minify: {
          removeScriptTypeAttributes: true,
        },
      }),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.EnvironmentPlugin({
        BUILD_DATE: JSON.stringify(BUILD_DATE),
        IMAGE_TAG: JSON.stringify(process.env.IMAGE_TAG || false),
        NODE_ENV: JSON.stringify(mode),
      }),
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 250000, // Minimum number of characters
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
          test: /\.[t|j]sx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'thread-loader',
              options: {
                workerParallelJobs: 2,
              },
            },
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                babelrc: false,
                plugins: [
                  ['@babel/plugin-proposal-decorators', { legacy: true }],
                  ['@babel/plugin-proposal-class-properties', { loose: false }],
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
            }
          ],
        },
        {
          test: /\.s?css$/,
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
                    localIdentName: isDev ? '[name]-[local]-[hash:4]' : '[hash:base64]',
                    localIdentContext: path.resolve(__dirname, 'src'),
                    exportLocalsConvention: 'camelCase',
                  },
                  importLoaders: 1,
                  sourceMap: isDev,
                },
              },
              'sass-loader',
            ],
          }],
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline-loader',
          options: {
            classPrefix: true,
          },
        },
        {
          test: /\.(ttf|eot|woff2?|svg|ico|gif|png|jpe?g)$/,
          type: 'asset/resource',
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      host: 'localhost',
      hot: true,
      https: false,
      open: true,
      port: 8080,
      contentBase: './build',
    },
  };
}
