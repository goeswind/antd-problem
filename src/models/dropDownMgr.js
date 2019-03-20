import { subTree,enabled,addOrUpdate,get,doDelete} from '../services/dropDownMgrService';

export default {
  namespace: 'dropDownMgr',

  state: {
  },

  effects: {
    // put 是用来发起一条action
    // call 是以异步的方式调用函数
    // select 是从state中获取相关的数据
    // take获取发送的数据
    //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
    //然后在里面返回state等数据
    
    //获取子树
    *subTree({ payload, callback }, { call, put }) {
      const response = yield call(subTree, payload);
      yield put({
        type: 'doSubTree',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //禁用、启用
    *enabled({ payload, callback }, { call, put }) {
      const response = yield call(enabled, payload);
      if (callback) callback(response);
    },
    //新增或修改
    *addOrUpdate({ payload, callback }, { call, put }) {
      const response = yield call(addOrUpdate, payload);
      if (callback) callback(response);
    },
    //查询单条
    *get({ payload, callback }, { call, put }) {
      const response = yield call(get, payload);
      if (callback) callback(response);
    },
    //删除
    *doDelete({ payload, callback }, { call, put }) {
      const response = yield call(doDelete, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    doSubTree(state, action) {
      return {
        ...state,
        treeList:action.payload,
      };
    }
  },
};
