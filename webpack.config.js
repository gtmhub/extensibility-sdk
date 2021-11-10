const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  name: "gtmhub-plugin-sdk",
  entry: "./src/index.ts",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: dist,
    library: "gtmhub",
    libraryTarget: "umd",
    filename: "index.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
