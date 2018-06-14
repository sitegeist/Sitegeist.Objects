const path = require('path');

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	devtool: 'source-map',
	entry: {
		app: [`./Resources/Private/JavaScript/index.js`],
		env: ['babel-polyfill', `./Resources/Private/JavaScript/env.js`]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx'],
		alias: {
			shim: path.resolve(__dirname, 'Resources/Private/JavaScript/shim'),
			'@sitegeist-objects/core/util': path.resolve(__dirname, 'Resources/Private/JavaScript/core/util'),
			'@sitegeist-objects/core/flashMessage': path.resolve(__dirname, 'Resources/Private/JavaScript/core/flashMessage'),
			'@sitegeist-objects/query': path.resolve(__dirname, 'Resources/Private/JavaScript/query'),
			'@sitegeist-objects/lib': path.resolve(__dirname, 'Resources/Private/JavaScript/lib'),
			'smooth-dnd': path.resolve(__dirname, 'Resources/Private/JavaScript/shim/smooth-dnd')
		}
	},
	output: {
		path: `${__dirname}/Resources/Public/JavaScript`,
		filename: `[name].js`
	}
};
