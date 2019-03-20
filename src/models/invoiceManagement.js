import { invoiceTableList,sendEmail,disableOrderItemInvoice,
  orderItemInvoiceDetail,cancleOrderItemInvoice,receiveMoneyFn,
  invoiceDeleteFn,orderItemPageTab
 } from '../services/myManagement';

export default {
    namespace: 'invoiceManagement',

    state: {
        modelList: [], //发票列表 -待对账
        modelList2: [], //发票列表 -已对账
        modelList3: [], //发票列表 -已退回
        invoiceDetail: [], //发票明细列表
        queryListObj:{
            size: "", //每页显示条数 number
            current: "", //当前页 number
        },
        queryListObj2:{
            size: "", //每页显示条数 number
            current: "", //当前页 number
        },
        queryListObj3:{
            size: "", //每页显示条数 number
            current: "", //当前页 number
        },
        ItemPageTab:{
          data:{
            sumDo:0,
            sumReturn:0,
            sumUnDo:0
          }
        }
      },
    
      effects: {
        //发票管理管理--发票列表
        //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，再发起请求
          *saveQueryProData({ payload, callback }, { call, put,select }) {
            let response = yield select((state) => {return state.invoiceManagement.queryListObj})
            //将payload的内容替换response里有的内容
            let sendData = Object.assign(response,payload)
            yield put({
              type: 'queryAll',
              payload: sendData
            })
            if (callback) callback(sendData)
          },
          //发票明细
          *queryDetailList({ payload, callback }, { call, put,select }) {
            const response = yield call(orderItemInvoiceDetail, payload);
            yield put({
              type: 'saveDetailList',
              payload: response,
            });
            if (callback) callback(response);
          },
          //请求列表
          *queryList({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.invoiceManagement.queryListObj})
            const response = yield call(invoiceTableList, sendData);
            yield put({
              type: 'invoiceAllList',
              payload: response,
            });
            if (callback) callback(response);
          },
          *saveQueryProData2({ payload, callback }, { call, put,select }) {
            let response = yield select((state) => {return state.invoiceManagement.queryListObj2})
            //将payload的内容替换response里有的内容
            let sendData = Object.assign(response,payload)
            yield put({
              type: 'queryAll2',
              payload: sendData
            })
            if (callback) callback(sendData)
          },
          //请求列表
          *queryList2({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.invoiceManagement.queryListObj2})
            const response = yield call(invoiceTableList, sendData);
            yield put({
              type: 'invoiceAllList2',
              payload: response,
            });
            if (callback) callback(response);
          },
          *saveQueryProData3({ payload, callback }, { call, put,select }) {
            let response = yield select((state) => {return state.invoiceManagement.queryListObj3})
            //将payload的内容替换response里有的内容
            let sendData = Object.assign(response,payload)
            yield put({
              type: 'queryAll3',
              payload: sendData
            })
            if (callback) callback(sendData)
          },
          //请求列表
          *queryList3({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.invoiceManagement.queryListObj3})
            const response = yield call(invoiceTableList, sendData);
            yield put({
              type: 'invoiceAllList3',
              payload: response,
            });
            if (callback) callback(response);
          },
          //发送电子邮件
          *querySendEmail({ payload, callback }, { call, put,select }) {
            const response = yield call(sendEmail, payload);
            if (callback) callback(response);
          },
          //发票作废---已开票才能作废
          *queryDisableOrderItemInvoice({ payload, callback }, { call, put,select }) {
            const response = yield call(disableOrderItemInvoice, payload);
            if (callback) callback(response);
          },
          //发票取消
          *queryCancleOrderItemInvoice({ payload, callback }, { call, put,select }) {
            const response = yield call(cancleOrderItemInvoice, payload);
            if (callback) callback(response);
          },
          //实收确认
          *queryReceiveMoneyFn({ payload, callback }, { call, put,select }) {
            const response = yield call(receiveMoneyFn, payload);
            if (callback) callback(response);
          },
          //发票记录删除
          *queryInvoiceDeleteFn({ payload, callback }, { call, put,select }) {
            const response = yield call(invoiceDeleteFn, payload);
            if (callback) callback(response);
          },
          //发票tab的数量
          *queryOrderItemPageTab({ payload, callback }, { call, put,select }) {
            const response = yield call(orderItemPageTab, payload);
            if(response.code==200){
                yield put({
                  type: 'saveItemPageTab',
                  payload: response,
                });
            }
            if (callback) callback(response);
          },

      },
    
      reducers: {
        saveItemPageTab(state, action) {
          return {
            ...state,
            ItemPageTab:action.payload
          };
        },
        saveDetailList(state, action) {
          return {
            ...state,
            invoiceDetail:action.payload
          };
        },
        invoiceAllList(state, action) {
          return {
            ...state,
            modelList:action.payload
          };
        },
        queryAll(state, action) {
            return {
              ...state,
              queryListObj:action.payload,
            };
        },
        invoiceAllList2(state, action) {
          return {
            ...state,
            modelList2:action.payload
          };
        },
        queryAll2(state, action) {
            return {
              ...state,
              queryListObj2:action.payload,
            };
        },
        invoiceAllList3(state, action) {
          return {
            ...state,
            modelList3:action.payload
          };
        },
        queryAll3(state, action) {
            return {
              ...state,
              queryListObj3:action.payload,
            };
        },
      },
    };
    