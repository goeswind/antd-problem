console.log('environment.config.js');
console.log('process.env.APP_ENV: '+process.env.APP_ENV);
/*
let proxyHostPort = '192.168.100.83:8060';
if(process.env.APP_ENV === 'product') {
	proxyHostPort = '192.168.100.88:8080';
} else if(process.env.APP_ENV === 'my') {
	proxyHostPort = 'localhost:8080';
}

export const PROXY_HOST_PORT = proxyHostPort;
*/