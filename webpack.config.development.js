import webpack from 'webpack'
import validate from 'webpack-validator'
import merge from 'webpack-merge'
import formatter from 'eslint-formatter-pretty'
import baseConfig from './webpack.config.base'
import path from 'path'

const port = process.env.PORT || 3000

export default validate(merge(baseConfig, {
	debug: true,

	devtool: 'inline-source-map',

	entry: [
		`webpack-hot-middleware/client?reload=true&path=http://localhost:${port}/__webpack_hmr`,
		'babel-polyfill',
		'./app/index'
	],

	output: {
		publicPath: `http://localhost:${port}/dist/`
	},

	module: {
		loaders: [{
				test: /\.global\.css$/,
				loaders: [
					'style-loader',
					'css-loader?sourceMap'
				]
			},

			{
				test: /\.css$/,
				loaders: [
					'style-loader',
					'css-loader'
				]
			},

			// {
			//   test: /^((?!\.global).)*\.css$/,
			//   loaders: [
			//     'style-loader',
			//     'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			//   ]
			// },

			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			}, {
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/font-woff'
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=application/octet-stream'
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file'
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url?limit=10000&mimetype=image/svg+xml'
			},
		],
		noParse: [
			path.join(__dirname, 'node_modules', 'pouchdb', 'dist')
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),

		new webpack.NoErrorsPlugin(),

		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new webpack.IgnorePlugin(/vertx/)
	],

	eslint: {
		formatter
	},

	target: 'electron-renderer'
}))
