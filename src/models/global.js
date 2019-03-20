import { inforReceiveuserPage,countUnRead,readCommit } from '../services/api';

export default {
  namespace: 'global',

  state: {
    saveLoginData:"",
    collapsed: false,
    notices:{
      data:{
        records:[]
      }
    },
    menus:"",//大屏选择后的地址数据
    unreadCount:{
      data:{
        countUnRead:""
      }
    }
  },

  effects: {
    *fetchNotices({ payload, callback }, { call, put,select }) {
      const data = yield call(inforReceiveuserPage,payload);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *fetchCount({ payload, callback }, { call, put,select }) {
      const data = yield call(countUnRead,payload);
      yield put({
        type: 'saveCount',
        payload: data,
      });
    },
    *loginData({ payload, callback }, { call, put,select }) {
      yield put({
        type: 'saveLoginData',
        payload: payload,
      });
    },
    *fetchReadCommit({ payload, callback }, { call, put,select }) {
      const data = yield call(readCommit,payload);
      if (callback) callback(response);
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    saveLoginData(state, { payload }) {
      return {
        ...state,
        saveLoginData: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveCount(state, { payload }) {
      return {
        ...state,
        unreadCount: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveCurrMenu(state, { payload }) {
      return {
        ...state, 
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
