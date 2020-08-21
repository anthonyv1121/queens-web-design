const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PurifyCSSPlugin = require("purifycss-webpack");
const glob = require("glob-all");

module.exports = {
  entry: {
    main: ["babel-polyfill", "./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(handlebars|hbs)$/,
        loader: "handlebars-loader"
      },
      {
        test: /\.ejs$/,
        use: ["ejs-webpack-loader"]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          options: {
            attrs: ["img:src", "link:href"],
            root: path.resolve(__dirname, "src/assets/")
          }
        }
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: "url-loader?name=/fonts/[name].[ext]"
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    compress: true,
    port: 7000,
    hot: false,
    watchContentBase: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/index.handlebars",
      filename: "index.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/services.handlebars",
      filename: "services/index.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/union-websites.handlebars",
      filename: "services/union-websites.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/work.handlebars",
      filename: "work/index.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/mobile-app.handlebars",
      filename: "mobile-app-design/index.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/partners.handlebars",
      filename: "partners/index.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/articles-thank-you.handlebars",
      filename: "articles/index.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/web-design-lessons.handlebars",
      filename: "web-design-tutor.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/articles/article-1.handlebars",
      filename: "articles/why-every-business-needs-a-website.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/articles/article-2.handlebars",
      filename: "articles/features-of-a-great-small-business-website.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/articles/article-3.handlebars",
      filename: "articles/web-design-process.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./src/pages/articles/what-is-seo.handlebars",
      filename: "articles/seo-101.html",
      allChunks: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.[hash].css",
      allChunks: true
    })
    //   new PurifyCSSPlugin({
    //     paths: glob.sync([
    //         path.join(__dirname, 'src/*.html'),
    //         path.join(__dirname, 'src/*.hbs'),
    //         path.join(__dirname, 'src/*.handlebars'),
    //         path.join(__dirname, 'src/*.js')
    //     ]),
    //     minimize: true,
    //     purifyOptions: {
    //         whitelist: []
    //     }
    // })
  ]
};
