const path = require('path');
const webpack = require('webpack');
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
			? [new webpack.SourceMapDevToolPlugin()]
			: [],
		optimization: {
			minimize: !isDevBuild
		},
		mode: isDevBuild ? 'development' : 'production',
	}];
};
