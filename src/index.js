// 项目的入口文件为 index.js文件。 
// 在该文件中首先实例化一个dva应用，
// 然后设置该应用的model和router，最后启动（start） 
// 在model中主要用来编写整个应用的业务逻辑，包括redux的整个流程，同步、异步获取数据等操作。
// 在router中底层应该是使用了react-router来负责整个系统的路由，然后在路由中配置各自路由对应的页面，
// 也就是组件（components）
import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');


FastClick.attach(document.body);

export default app._store;  // eslint-disable-line
