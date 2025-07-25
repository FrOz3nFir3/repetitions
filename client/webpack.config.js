const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode || "development";
  const isAnalyze = env.analyze || false;
  const isDevelopment = mode === "development";

  const plugins = [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
  ];

  if (isAnalyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  if (isDevelopment) {
    plugins.push(new ReactRefreshWebpackPlugin());
  }

  return {
    entry: {
      main: "./src/app/main.js",
    },
    output: {
      path: path.join(__dirname, "..", "server", "public"),
      publicPath: "/",
      filename: "js/[name].bundle.js",
      chunkFilename: "js/[name].bundle.js",
    },
    cache: {
      type: "filesystem",
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        maxSize: 240000,
      },
    },
    performance: {
      maxAssetSize: 500 * 1024, // 500kb in bytes
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                transform: {
                  react: {
                    development: isDevelopment,
                    refresh: isDevelopment,
                  },
                },
              },
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
    mode,
    devtool: isDevelopment ? "eval-source-map" : false,
    plugins,
    devServer: {
      historyApiFallback: true,
      port: 80,
      hot: true,
    },
  };
};