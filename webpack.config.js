const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const nodeExternals = require("webpack-node-externals");
const ESLintPlugin = require("eslint-webpack-plugin");

const bundleOutputDir = "./dist";
module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	const defaultPlugins = [
		new CopyWebpackPlugin({
			patterns: [
				{ from: "./_headers" }, // you may need to change `to` here.
			],
		}),
		new Dotenv(),
	];
	const devPlugins = [...defaultPlugins, new ESLintPlugin()];

	return [
		{
			entry: "./index.js",
			output: {
				filename: "widget.js",
				path: path.resolve(bundleOutputDir),
			},
			devServer: {
				static: bundleOutputDir,
			},
			plugins: isDevBuild ? devPlugins : defaultPlugins,
			optimization: {
				minimize: !isDevBuild,
			},
			mode: isDevBuild ? "development" : "production",
			resolve: {
				extensions: [".*", ".js"],
			},
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /node_modules/,
						use: {
							loader: "babel-loader",
							options: {
								presets: ["@babel/preset-env"],
							},
						},
					},
				],
			},
			externals: [nodeExternals({ importType: "var" })],
		},
	];
};
