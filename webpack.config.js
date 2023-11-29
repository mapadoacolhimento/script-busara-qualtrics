const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = './dist';
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	return [{
		entry: './index.js',
		output: {
			filename: 'widget.js',
			path: path.resolve(bundleOutputDir),
		},
		devServer: {
			contentBase: bundleOutputDir
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
		externalsPresets: { node: true }
	}];
};
