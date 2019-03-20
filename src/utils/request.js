import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import myutil from './myutil';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  // console.log('request resp11', response);
  if(response.url.indexOf('/shopSeller/login')>0
	  ||response.url.indexOf('/shopSeller/currentUser')>0)
	  return response;
  const token = myutil.auth.getToken();
  // console.log('request resp22', token, response);
  if(!token) {
    const { dispatch } = store;
	dispatch(routerRedux.push('/user/login'));
	return;
  }
  if (response.status == 200) {
    return response;
  }
  if (response.code == 200) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // console.log('request resp33', errortext);
  //message.error('无法调用到后台服务，请联系管理员');

  /*notification.error({
    //message: `请求错误 ${response.status}: ${response.url}`,
	message: `无法调用到后台服务，请联系管理员`,
    description: errortext,
  });*/
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */


export default function request(url, options) {
  function urlencodeFormData(fd){
    var s = []

    for (var key in fd) {
	  if (fd.hasOwnProperty(key)) {
		let val = fd[key];
		// console.log('typeof val'+typeof val)
		if(val && typeof val=='string' 
			&& ((val.indexOf('{')==0 && val.lastIndexOf('}')==(val.length-1)) || (val.indexOf('[')==0 && val.lastIndexOf(']')==(val.length-1)))
			)
			//如果key、value中的value是字符串类型，且是json对象或数组序列化为字符串的，就不要再encode了，否则会报错
			s.push(encodeURIComponent(key) + '=' + fd[key]);
		else
			s.push(encodeURIComponent(key) + '=' + encodeURIComponent(fd[key])); 
	  }
    }

    return s.join('&')
  }
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  const token = myutil.auth.getToken();
  newOptions.headers = {
	Authentication: token,
	...newOptions.headers
  };
  if(newOptions.headers 
	  && newOptions.headers['Content-Type']
	  && newOptions.headers['Content-Type'].indexOf('x-www-form-urlencoded')>0) {
	if(newOptions.body instanceof Object) {
		//将object body转换成key=value字符串，以支持x-www-form-urlencoded表单post提交方式
		newOptions.body = urlencodeFormData(newOptions.body);
	}
  } else {
	  // console.log('isnot urlencoded');
	  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
		if (!(newOptions.body instanceof FormData)) {
		  newOptions.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json; charset=utf-8',
			...newOptions.headers,
		  };
		  newOptions.body = JSON.stringify(newOptions.body);
		} else {
		  // newOptions.body is FormData
		  newOptions.headers = {
			Accept: 'application/json',
			'Content-Type': 'multipart/form-data',
			...newOptions.headers,
		  };
		}
	  }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
	  // console.log('fetch response11', response);
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
	  let resptxt = response.json(); //这里必须用json，之前改成text，结果全部变成了字符串，而不是json对象
	  // console.log('typeof resptxt', typeof resptxt); //
	  if(typeof resptxt=='string')
		  resptxt = JSON.parse(resptxt);
	  // console.log('fetch resptxt11', resptxt);
      return resptxt;
    })
    .catch((e) => {
	  // console.log('fetch error', e);
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
