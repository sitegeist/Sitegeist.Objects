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
			shim: path.resolve(__dirname, 'Resources/Private/JavaScript/shim')
		}
	},
	output: {
		path: `${__dirname}/Resources/Public/JavaScript`,
		filename: `[name].js`
	}
};
