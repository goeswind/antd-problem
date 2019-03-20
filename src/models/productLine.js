/**
 * 
 * @description 项目说明 产品线路模块
 * @author    hcf  2017/11/17
 * @warning   
 * 
 */

import { queryProductLineList } from '../services/api';

export default {
  namespace: 'productLine',  

  state: {
    ProductLineList: [], 
    queryListObj:{
      current:'',
      size:'',
      contractFileName:"",	//产品名称	string	非必填
      createEndDate:"",	    //创建结束时间	string	必填
      createStartDate:""    //创建开始时间	string	必填
    }
  },

  effects: {
    //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，在发起请求
    *saveQueryProData({ payload, callback }, { call, put,select }) {
      let response = yield select((state) => {return state.productLine.queryListObj})
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
      // const {page,pageSize,corpName,corpBy,creditno,deptBy,supplierCode,supplierName,createTimeStart,createTimeEnd}=payload
      const sendData = yield select((state) => {return state.productLine.queryListObj})
      const response = yield call(queryProductLineList, sendData);
      yield put({
        type: 'saveProductLineList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveProductLineList(state,action){
        return {
          ...state,
          ProductLineList:action.payload
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