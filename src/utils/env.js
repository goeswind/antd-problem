export default (() => {
  window.gconfig = {};
  +(function (global) {
        
	// 本地开发打开的路径以及端口
    global.uploadUrl = '//app.sdnsy.com/sys/oss/upload/';
    global.ocxUrl = 'http://pdfservice.sdnsy.com/';
	console.log('process.env.APP_TYPE 99');
	try {
		// 本地开发打开的路径以及端口
		//console.log(process.env.npm_package_config_environment);
		console.log(process.env.APP_TYPE);
		console.log('22 process.env.myenv: '+process.env.myenv);
		console.log('22 process.env.DEBUG2: '+process.env.DEBUG2);
		console.log('22 process.env.DEBUG3: '+process.env.DEBUG3);

		if(process.env.NODE_ENV.indexOf('dev')==0) { 
		  global.uploadUrl = '//localhost:8080/sys/oss/upload/';
		  global.ocxUrl = 'http://127.0.0.1:8083/';
		}
		console.log('global.uploadUrl: '+global.uploadUrl);
		console.log('global.ocxUrl: '+global.ocxUrl);
	} catch(e){}
  }(window.gconfig));
})()

export const uploadUrl = global.gconfig.uploadUrl;

export const ocxUrl = global.gconfig.ocxUrl;
