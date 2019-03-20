import {queryListFn} from '../services/api';

export default {
  namespace: 'example',

  state: {
    queryListObj:{
        current:"",	//	当前页	number	必填。@mock=1
        size:"",	//	每页显示行数	number	必填。@mock=10
    },
    modelList:[],
  },

  effects: {
    //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，在发起请求
    *saveQueryProData({ payload, callback }, { call, put,select }) {
      let response = yield select((state) => {return state.example.queryListObj})
      //将payload的内容替换response里有的内容
      let sendData=Object.assign(response,payload)
      yield put({
        type: 'saveQueryPro',
        payload: sendData
      })
      if (callback) callback(sendData)
    },
    //请求列表
    *queryList({ payload, callback }, { call, put,select }) {
      const sendData = yield select((state) => {return state.example.queryListObj})
      const response = yield call(queryListFn, sendData);
      yield put({
        type: 'saveModelList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveModelList(state,action){
      return {
        ...state,
        modelList:action.payload
      }
    },
    saveQueryPro(state,action){
      return {
        ...state,
        queryListObj:action.payload
      }
    }
  },
};
