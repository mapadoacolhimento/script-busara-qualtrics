const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = './dist';

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
		plugins: isDevBuild
			? [new webpack.SourceMapDevToolPlugin(), new CopyWebpackPlugin({
				patterns: [
					{ from: './_headers' }, // you may need to change `to` here.
				],
			})]
			: [new CopyWebpackPlugin({
				patterns: [
					{ from: './_headers' }, // you may need to change `to` here.
				],
			})],
		optimization: {
			minimize: !isDevBuild
		},
		mode: isDevBuild ? 'development' : 'production',
	}];
};
