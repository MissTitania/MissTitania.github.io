const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// This config assumes all CSS is in .scss files

const cssConfig =
{
	entry: './css/main.scss',
	output:
	{
		path: path.resolve('./built'),
		filename: 'bundle.css',
	},
	module:
	{
		rules:
		[
			{ // sass / scss loader for webpack. 
				test: /\.(sass|scss)$/,
				loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
			}
		]
	},
	plugins:
	[
		new ExtractTextPlugin("bundle.css")
	]
}

const jsConfig =
{
	entry: "./javascript/main.js",
	output:
	{
		path: path.resolve('./built'),
		filename: "bundle.js"
	},
	module:
	{
		rules:
		[
			{
				test: /\.txt$/,
				use: 'raw-loader'
			}
		]
	}
}

// Return Array of Configurations
module.exports =
[
	jsConfig, cssConfig
]