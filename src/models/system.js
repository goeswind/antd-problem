import { queryAppList, queryUserList, queryOrgList, queryRoleList, queryMenuList,
		saveApp, saveUser, saveOrg, saveRole, saveMenu,
		delApp, delUser, delOrg, delRole, delMenu} from '../services/system';

export default {
  namespace: 'system',

  state: {
    list: [],
    currentUser: {},
  },


  effects: {
    // put 是用来发起一条action
    // call 是以异步的方式调用函数
    // select 是从state中获取相关的数据
    // take获取发送的数据
    //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
    //然后在里面返回state等数据
    *delApp({ payload, callback }, { call, put }) {
      const response = yield call(delApp, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delUser({ payload, callback }, { call, put }) {
      const response = yield call(delUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *delOrg({ payload, callback }, { call, put }) {
      const response = yield call(delOrg, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *delRole({ payload, callback }, { call, put }) {
      const response = yield call(delRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *delMenu({ payload, callback }, { call, put }) {
      const response = yield call(delMenu, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveMenu({ payload, callback }, { call, put }) {
      const response = yield call(saveMenu, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *saveRole({ payload, callback }, { call, put }) {
      const response = yield call(saveRole, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *saveOrg({ payload, callback }, { call, put }) {
      const response = yield call(saveOrg, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *saveUser({ payload, callback }, { call, put }) {
      const response = yield call(saveUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *saveApp({ payload, callback }, { call, put }) {
      const response = yield call(saveApp, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      // console.log(response)
      if (callback) callback(response);
    },
    *queryMenuList({ payload, callback }, { call, put }) {
      const response = yield call(queryMenuList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *queryRoleList({ payload, callback }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *queryOrgList({ payload, callback }, { call, put }) {
      const response = yield call(queryOrgList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *queryAppList({ payload, callback }, { call, put }) {
	  // console.log('model queryAppList payload '+JSON.stringify(payload));
      const response = yield call(queryAppList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *queryUserList({ payload, callback }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
	  console.log('system model 888');
	  console.log(state);
	  console.log(action);
      return {
        ...state,
        list: action.payload,
      };
    }
  },
};
