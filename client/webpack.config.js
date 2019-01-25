const path = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const autoprefixer = require('autoprefixer')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? "production" : "development",
  entry: './src/main.tsx',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../static')
  },
  devtool: isProd ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                localIdentName: isProd ? '[hash:base64:5]' : '[local]-[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer()
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              typeCheck: false,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.ts', '.tsx', '.css']
  },
  plugins: [
    new ExtractTextPlugin("main.css"),
    new OptimizeCss()
  ],
  stats: {
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    moduleTrace: true,
    errorDetails: true
  }
};
