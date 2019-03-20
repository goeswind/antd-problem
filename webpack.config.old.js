const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

//清除缓存，刷新环境变量 https://github.com/nodejs/node/issues/3104
const env = process.env
delete process.env // might not be necessary
process.env = env
process.env = JSON.parse(JSON.stringify(process.env));

console.log('----------webpack.config.js------------');
console.log(process.env.APP_ENV);

module.exports = (config, { webpack }) => {
/*
  config.plugins.push(new webpack.optimize.UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        ecma: 6,
        compress: false // hangs without this
      },
      //cache: path.join(__dirname, 'webpack-cache/uglify-cache'),
    }));
*/
  config.plugins.push(

	new webpack.DefinePlugin({
	  'process.env': {
		  'APP_ENV': JSON.stringify(process.env.APP_ENV),
	  }
	}),
	
	new webpack.EnvironmentPlugin({
		'APP_ENV': JSON.stringify(process.env.APP_ENV),
	}),
	
  );

  console.log('----------webpack.config.js------------');
  console.log(config);
  return config;
}
