const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const nodeExternals = require("webpack-node-externals");
const ESLintPlugin = require("eslint-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

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

	const defaultConfig = {
		entry: "./index.js",
		plugins: isDevBuild ? devPlugins : defaultPlugins,
		optimization: {
			minimize: !isDevBuild,
		},
		mode: isDevBuild ? "development" : "production",
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
	};

	const serverConfig = {
		...defaultConfig,
		target: "node",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "widget.node.js",
		},
		resolve: {
			extensions: [".*", ".js"],
		},
		externals: [nodeExternals()],
	};

	const clientConfig = {
		...defaultConfig,
		plugins: isDevBuild
			? [
					...devPlugins,
					new NodePolyfillPlugin({
						excludeAliases: ["crypto"],
					}),
			  ]
			: [
					...defaultPlugins,
					new NodePolyfillPlugin({
						excludeAliases: ["crypto"],
					}),
			  ],
		target: "web",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "widget.js",
		},
		resolve: {
			extensions: [".*", ".js"],
			fallback: {
				crypto: require.resolve("crypto-browserify"),
			},
		},
	};

	return [serverConfig, clientConfig];
};
