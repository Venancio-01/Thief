process.env.BABEL_ENV = "web";

const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

let webConfig = {
  devtool: "eval-cheap-module-source-map",
  entry: {
    web: path.join(__dirname, "../src/renderer/main.js"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.sass$/,
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.less$/,
        use: ["css-loader", "less-loader"],
      },
      {
        test: /\.css$/,
        loader: "css-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [path.resolve(__dirname, "../src/renderer")],
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "imgs/[name].[ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "fonts/[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../src/index.ejs"),
      templateParameters(compilation, assets, options) {
        return {
          compilation: compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: options,
          },
          process,
        };
      },
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      nodeModules: false,
    }),
    new webpack.DefinePlugin({
      "process.env.IS_WEB": "true",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../dist/web"),
  },
  optimization: {
    noEmitOnErrors: true,
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "../src/renderer"),
      vue$: "vue/dist/vue.esm.js",
    },
    extensions: [".js", ".vue", ".json", ".css"],
  },
  target: "web",
};

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === "production") {
  webConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "../static"),
        to: path.join(__dirname, "../dist/web/static"),
        ignore: [".*"],
      },
    ]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"',
    })
  );
}

module.exports = webConfig;
