const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = './dist';
const Dotenv = require('dotenv-webpack');
const nodeExternals = require("webpack-node-externals");

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	return [{
		entry: './index.js',
		output: {
			filename: 'widget.js',
			path: path.resolve(bundleOutputDir),
		},
		devServer: {
			static: bundleOutputDir
		},
		plugins: [new CopyWebpackPlugin({
				patterns: [
					{ from: './_headers' }, // you may need to change `to` here.
				],
		}), new Dotenv()],
		optimization: {
			minimize: !isDevBuild
		},
		mode: isDevBuild ? 'development' : 'production',
		resolve: {
			extensions: [".*", ".js"],
			fallback: {
				// Use can only include required modules. Also install the package.
				// for example: npm install --save-dev assert
				crypto: require.resolve('crypto-browserify'),
				buffer: require.resolve('buffer'),
				stream: require.resolve('stream-browserify'),
			}
		},
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		externals: [nodeExternals({ importType: 'umd' })],
	}];
};
