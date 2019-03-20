import { queryData} from '../services/analysis';

export default {
  namespace: 'analysis',

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
    *queryData({ payload, callback }, { call, put }) {
      const response = yield call(queryData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    }
  },
};
