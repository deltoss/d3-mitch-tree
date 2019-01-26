const path = require('path');

var commonConfig = {
	// Common Configurations for multiple outputs
	entry: {
		"d3-mitch-tree": './src/index.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}]
	}
};

var fullConfig = {
	...commonConfig, // ES6 Spread operator
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist/js'),
		library: ["d3", "mitchTree"],
		libraryExport: 'default',
		libraryTarget: 'umd',
		publicPath: './dist',
		umdNamedDefine: true,
		// To make it compatible with both web and node for UMD bundles,
		// as well as fix an issue with webpack:
		//   https://github.com/webpack/webpack/issues/6677
		//   https://github.com/webpack/webpack/issues/6525
		globalObject: "this"
	},
	optimization: {
		minimize: false
	}
}

var minifiedConfig = {
	...commonConfig,
	output: {
		filename: '[name].min.js',
		path: path.resolve(__dirname, 'dist/js'),
		library: ["d3", "mitchTree"],
		libraryExport: 'default',
		libraryTarget: 'umd',
		publicPath: './dist',
		umdNamedDefine: true,
		globalObject: "this"
	},
	optimization: {
		minimize: true
	}
};

var entryPointConfig = {
	...commonConfig,
	target: 'node',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'lib'),
		library: ["d3", "mitchTree"],
		libraryExport: 'default',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	optimization: {
		minimize: true
	}
}

module.exports = [
	fullConfig, minifiedConfig, entryPointConfig
]