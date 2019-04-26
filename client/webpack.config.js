const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? "production" : "development",
  entry: './src/Main.tsx',
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
