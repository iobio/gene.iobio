var path = require('path')
var webpack = require('webpack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: "[name].[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [],
  // resolve: {
  //   alias: {
  //     'vue$': 'vue/dist/vue.esm.js'
  //   }
  // },
  performance: {
    hints: false
  },
  devtool: 'cheap-module-inline-source-map'
}

