const appEnv = process.env.APP_ENV;
console.log('webpackrc.js');
console.log(appEnv);

let proxyHostPort = '192.168.100.85:8086';
let proxyHostPort02='192.168.100.85:8100';
if(appEnv === 'pro') {
	proxyHostPort = '192.168.100.88:8080';
} else if(appEnv === 'sit') {
	proxyHostPort = '192.168.100.85:8086';
} else if(appEnv === 'test') {
	proxyHostPort = '192.168.100.86:8086';
} else if(appEnv === 'my') {
	proxyHostPort = 'localhost:8086';
}
console.log('webpackrc.js');
console.log('proxyHostPort: '+proxyHostPort);

export default {

  entry: "src/index.js",

  //?????????????bi-web2????svn???????????antd?????
  // outputPath: '/workdir/code/BI/www/bi-web2/src/main/resources/static',
  // outputPath: '/YZW/BISvnBuild/static',

  extraBabelPlugins: [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr"
      ]
    }
  },
  ignoreMomentLocale: true,
  theme: "./src/theme.js",
  html: {
    template: "./src/index.ejs"
  },
  publicPath: "/",
  disableDynamicImport: !appEnv && appEnv === 'my', 
  //disableDynamicImport: true, 
  hash: true,

  proxy: {
    //后台管理系统的代理地址
    "/admin": {
      target: "http://"+proxyHostPort+"/admin",  //测试服地址
      // target: "http://172.16.10.45:8086/admin",//林承志
      // target: "http://172.16.10.122:8080/admin",//钟晓龙
    // target: "http://172.16.10.67:8086/admin",//君和本地
    // target: "http://172.16.10.58:8086/admin",//柏林本地
    // target: "http://172.16.10.6:8086/admin",//柏林本地
    // target: "http://172.16.10.57:8080/admin",//本地
    
		changeOrigin: true,
		pathRewrite: { "^/admin" : "" }
    },
    //通用代理地址
    "/portal": {
		target: "http://"+proxyHostPort+"/portal",  //测试服地址
		// target: "http://172.16.10.67:8086/admin",//君和本地
		changeOrigin: true,
		pathRewrite: { "^/portal" : "" }
    },
    "/api/upload":{
      target: "http://192.168.100.83:8090/mall",
      changeOrigin: true,
      pathRewrite: { "^/api/upload" : "" }
  	},
    "/api/login": {
		target: "http://"+proxyHostPort+"/api/login",
		changeOrigin: true,
		pathRewrite: { "^/api/login" : "" }
    },
    "/api/user": {
		target: "http://"+proxyHostPort+"/api/user",
		changeOrigin: true,
		pathRewrite: { "^/api/user" : "" }
    },
    "/base": {
		target: "http://"+proxyHostPort+"/base",
		changeOrigin: true,
		pathRewrite: { "^/base" : "" }
    },
    "/report": {
      target: "http://"+proxyHostPort02+"/report",
      changeOrigin: true,
      pathRewrite: { "^/report" : "" }
    }
  },
}