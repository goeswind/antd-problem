import {orderCheckBillList,orderCheckbillCreate,
  finishCheckBillList,cancelCheckBillList,orderCheckbillMapping,
  invoiceTitle,saveOrderItemInvoice,invoiceTitleSave
} from '../services/api';

export default {
  namespace: 'monthAccount',

  state: {
    queryListObj:{
        current:"",	//	当前页	number	必填。@mock=1
        size:"",	//	每页显示行数	number	必填。@mock=10
        checkbillMonth:"2019/01/01",//月结日期	string	 
        companyName:"",//企业名称	string	 
    },
    modelList:[],
    queryListObj2:{
      companyName:"",//	企业名称	string	 
      checkbillMonth:"2019/01/01",//	月结月份	string	 
      custState:"",//		客户对账状态	int	0-未确认（客户可取消），1-已确认（不允许客户再取消），2-已取消，3-已失效
      ticketState:"",//		开票状态	int	0-未开票，1-已开票，2-已失效
      current:"",//		查询页码	int	 
      size:"",//		每页最大条数	int	 
    },
    modelList2:[],
    Invoice:"",//选择的发票请求参数,用于请求发票抬头信息
    InvoiceTitle:{},
    tabkey:"1",//tab的key
  },

  effects: {
    //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，在发起请求
    *saveQueryProData({ payload, callback }, { call, put,select }) {
      let response = yield select((state) => {return state.monthAccount.queryListObj})
      //将payload的内容替换response里有的内容
      console.log('这里是model')
      let sendData=Object.assign(response,payload)
      yield put({
        type: 'saveQueryPro',
        payload: sendData
      })
      if (callback) callback(sendData)
    },
    //查询待对账列表
    *queryList({ payload, callback }, { call, put,select }) {
      const sendData = yield select((state) => {return state.monthAccount.queryListObj})
      const response = yield call(orderCheckBillList, sendData);
      yield put({
        type: 'saveModelList',
        payload: response,
      });
      if (callback) callback(response);
    },

    //生成对账单
    *CreateOrderCheckbill({ payload, callback }, { call, put,select }) {
      const response = yield call(orderCheckbillCreate, payload);
      if (callback) callback(response);
    },
    //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，在发起请求
    *saveQueryProData2({ payload, callback }, { call, put,select }) {
      let response = yield select((state) => {return state.monthAccount.queryListObj2})
      //将payload的内容替换response里有的内容
      console.log('这里是model')
      let sendData=Object.assign(response,payload)
      yield put({
        type: 'saveQueryPro2',
        payload: sendData
      })
      if (callback) callback(sendData)
    },
    //查询对账单列表
    *queryList2({ payload, callback }, { call, put,select }) {
      const sendData = yield select((state) => {return state.monthAccount.queryListObj2})
      const response = yield call(finishCheckBillList, sendData);
      yield put({
        type: 'saveModelList2',
        payload: response,
      });
      if (callback) callback(response);
    },
    //取消对账单
    *cancelList({ payload, callback }, { call, put,select }) {
      const response = yield call(cancelCheckBillList, payload);
      if (callback) callback(response);
    },
    //查询对账单明细
    *detailList({ payload, callback }, { call, put,select }) {
      const response = yield call(orderCheckbillMapping, payload);
      if (callback) callback(response);
    },
   
    *queryInvoice ({ payload }, { call, put }) {
      yield put({
        type: 'saveInvoice',
        payload: payload,
      });
    },
    //存储tab的key
    *queryTabkey ({ payload }, { call, put }) {
      yield put({
        type: 'saveTabkey',
        payload: payload,
      });
    },
    //请求发票详情信息
    *queryInvoiceTitle({ payload, callback }, { call, put,select }) {
      const response = yield call(invoiceTitle, payload);
      if(response.code==200){
        if(response.data.length!=0){
          yield put({
            type: 'saveInvoiceTitle',
            payload: response.data[0],
          });
        }
      }
      if (callback) callback(response);
    },
    //开票信息保存
    *saveOrderItemInvoice({ payload, callback }, { call, put,select }) {
      const response = yield call(saveOrderItemInvoice, payload);
      if (callback) callback(response);
    },
    //新建发票信息
    *saveInvoiceTitleSave({ payload, callback }, { call, put,select }) {
      const response = yield call(invoiceTitleSave, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    saveInvoiceTitle(state,action){
      return {
        ...state,
        InvoiceTitle:action.payload
      }
    },
    saveTabkey(state,action){
      return {
        ...state,
        tabkey:action.payload
      }
    },
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
    },
    saveModelList2(state,action){
      return {
        ...state,
        modelList2:action.payload
      }
    },
    saveQueryPro2(state,action){
      return {
        ...state,
        queryListObj2:action.payload
      }
    },
    saveInvoice(state,action){
      return {
        ...state,
        Invoice:action.payload
      }
    },
  },
};
