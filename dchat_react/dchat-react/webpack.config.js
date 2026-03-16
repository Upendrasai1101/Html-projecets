const path    = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    index: path.join(__dirname, "src", "dchat_frontend", "src", "index.jsx"),
  },
  devtool: isDevelopment ? "source-map" : false,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util:   require.resolve("util/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", "dchat_frontend"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.CANISTER_ID_DCHAT_BACKEND": JSON.stringify(
        process.env.CANISTER_ID_DCHAT_BACKEND || "uxrrr-q7777-77774-qaaaq-cai"
      ),
      "process.env.DFX_NETWORK": JSON.stringify("local"),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "dchat_frontend", "src", "index.html"),
      filename: "index.html",
      chunks: ["index"],
    }),
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
    hot: true,
    liveReload: true,
  },
};
