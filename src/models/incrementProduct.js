import {queryIncrementList,queryCountingRule} from '../services/api';

export default {
  namespace: 'incrementProduct',

  state: {
    queryListObj:{
        contractType:"",	//产品名称	string	非必填。
        current:"",	//	当前页	number	必填。@mock=1
        size:"",	//	每页显示行数	number	必填。@mock=10
        state:"",	//	状态	string	非必填。传入code
    },
    incrementProductList:[],
    incrementRuleRuleList:[]
  },

  effects: {
    //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，在发起请求
    *saveQueryProData({ payload, callback }, { call, put,select }) {
      let response = yield select((state) => {return state.incrementProduct.queryListObj})
      //将payload的内容替换response里有的内容
      let sendData=Object.assign(response,payload)
      yield put({
        type: 'saveQueryPro',
        payload: sendData
      })
      if (callback) callback(sendData)
    },
    //请求列表
    *queryProduct({ payload, callback }, { call, put,select }) {
      const sendData = yield select((state) => {return state.incrementProduct.queryListObj})
      const response = yield call(queryIncrementList, sendData);
      yield put({
        type: 'saveincrementProductList',
        payload: response,
      });
      if (callback) callback(response);
    },
    //请求计费规则列表
    *queryIncrementRule({ payload, callback }, { call, put,select }) {
      const response = yield call(queryCountingRule, payload);
      yield put({
        type: 'saveIncrementRuleList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveIncrementRuleList(state,action){
      return {
        ...state,
        incrementRuleRuleList:action.payload
      }
    },
    saveincrementProductList(state,action){
      return {
        ...state,
        incrementProductList:action.payload
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
