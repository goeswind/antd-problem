/**
 * 
 * @description 项目说明 线路管理模块
 * @author    hcf  2017/11/21
 * @warning   
 * 
 */

import { queryLineList,queryCountingRule } from '../services/api';

export default {
  namespace: 'lineManagement',  

  state: {
    lineManagementList: [], 
    queryListObj:{
        size:"",//	每页显示条数	number	
        current:"",//	当前页	number	
        contractId:"",//	产品ID	number	非必填
        endCity:"",//	终点市	number	非必填。行政区域代码
        endDistrict:"",//	终点区县	number	非必填。行政区域代码
        endProvince:"",//	终点省	number	非必填。行政区域代码
        //endStreet:"",//	终点街道	number	非必填。行政区域代码
        startCity:"",//	起点市	number	非必填。行政区域代码
        startDistrict:"",//	起点区县	number	非必填。行政区域代码
        startProvince:"",//	起点省	number	非必填。行政区域代码
        //startStreet:"",//	起点街道	number	非必填。行政区域代码
        state:"",//	状态	string	非必填。传入Code
    },
    countingRuleList: [], 
    queryCountingRuleObj:{
        lineId:"",    //线路ID	number	
    }
  },

  effects: {
    //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，在发起请求
    *saveQueryProData({ payload, callback }, { call, put,select }) {
      let response = yield select((state) => {return state.lineManagement.queryListObj})
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
      const sendData = yield select((state) => {return state.lineManagement.queryListObj})
      const response = yield call(queryLineList, sendData);
      yield put({
        type: 'savelineManagementList',
        payload: response,
      });
      if (callback) callback(response);
    },
    //请求计费规则列表
    *queryCountingRule({ payload, callback }, { call, put,select }) {
      const response = yield call(queryCountingRule, payload);
      yield put({
        type: 'saveCountingRuleList',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveCountingRuleList(state,action){
        return {
          ...state,
          countingRuleList:action.payload
        }
    },
    savelineManagementList(state,action){
        return {
          ...state,
          lineManagementList:action.payload
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