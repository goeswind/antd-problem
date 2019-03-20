import { queryCustomerList} from '../services/customerManagement';

export default {
  namespace: 'customerManagement',

  state: {
    currentUser: {},
    customerList: [],//客户管理--客户列表
    modalCustomer:false,//客户管理--客户详情弹出框
  },

  effects: {
    // put 是用来发起一条action
    // call 是以异步的方式调用函数
    // select 是从state中获取相关的数据
    // take获取发送的数据
    //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
    //然后在里面返回state等数据
    
    //客户管理--客户列表查询
    *queryCustomerList({ payload, callback }, { call, put }) {
      const response = yield call(queryCustomerList, payload);
      yield put({
        type: 'saveCustomerList',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //客户管理--客户详情弹出框
    *modalCustomer({payload,callback},{put,call,select}){
      const response = yield select((state) => {return state.customerManagement.modalCustomer})
      yield put({
          type: 'changeCustomer',
          payload: !response
      }); 
  },
  },

  reducers: {
    saveCustomerList(state, action) {
      return {
        ...state,
        customerList:action.payload,
      };
    },
    changeCustomer(state,action){
      return {
        ...state,
        modalCustomer:action.payload
      }
    },
  },
};
