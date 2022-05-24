const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";

  return {
    entry: "./src/script.js",
    output: {
      path: path.join(__dirname, "..", "server", "public"),
      publicPath: "/",
    },
    module: {
      rules: [
        { test: /\.(js)$/, use: "babel-loader" },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
      ],
    },
    mode,
    plugins: [
      new HtmlWebpackPlugin({ template: "./src/index.html" }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(mode),
      }),
    ],
    devServer: {
      historyApiFallback: true,
      port: 80,
    },
  };
};
