const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    index: path.join(__dirname, "src", "dbank_assets", "src", "index.js"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", "dbank_assets"),
  },
  module: {
    rules: [
      { test: /\.(js|ts)x?$/, loader: "ts-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "dbank_assets", "src", "index.html"),
      filename: "index.html",
      chunks: ["index"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src", "dbank_assets", "assets"),
          to: path.join(__dirname, "dist", "dbank_assets"),
        },
      ],
    }),
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
    static: path.resolve(__dirname, "src", "dbank_assets", "assets"),
    hot: true,
    watchFiles: [path.resolve(__dirname, "src", "dbank_assets")],
    liveReload: true,
  },
};
