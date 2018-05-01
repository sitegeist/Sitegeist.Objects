module.exports = {
	mode: process.env.NODE_ENV || 'development',
	devtool: 'source-map',
	entry: {
		'app': `./Resources/Private/JavaScript/index.js`,
		'env': `./Resources/Private/JavaScript/env.js`
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
		extensions: ['*', '.js', '.jsx']
	},
	output: {
		path: `${__dirname}/Resources/Public/JavaScript`,
		filename: `[name].js`
	}
};
