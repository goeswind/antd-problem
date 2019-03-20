import { settleTableList,detailOrderBill } from '../services/myManagement';

export default {
    namespace: 'settleManagement',

    state: {
        allSettleList: [], //交易列表
        allSettleDetail: [], //交易明细列表
        queryListObj:{
            pageSize: "", //每页显示条数 number
            pageNumber: "", //当前页 number
            // pageNum: "", //交易明细 当前页
            param: {
              endtime:'', //结束时间
              startime: '', //开始时间
              state: "" //结算状态
            }
        },
        state: '', //结算状态
      },
    
      effects: {
        // put 是用来发起一条action
        // call 是以异步的方式调用函数
        // select 是从state中获取相关的数据
        // take获取发送的数据
        //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
        //然后在里面返回state等数据
        
        //商品管理--结算单列表
        //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，再发起请求
          *saveQuerySettle({ payload, callback }, { call, put,select }) {
            let response = yield select((state) => {return state.settleManagement.queryListObj})
            //将payload的内容替换response里有的内容
            let sendData = Object.assign(response,payload)
            yield put({
              type: 'querySettleList',
              payload: sendData
            })
            if (callback) callback(sendData)
          },
          //请求列表
          *saveSettleList({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.settleManagement.queryListObj})
            const response = yield call(settleTableList, sendData);
            yield put({
              type: 'settleList',
              payload: response,
            });
            if (callback) callback(response);
          },

          //交易详情明细列表
          *saveSettleListDetail({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.settleManagement.queryListObj})
            const response = yield call(detailOrderBill, sendData);
            yield put({
              type: 'settleListDetail',
              payload: response,
            });
            if (callback) callback(response);
          },
      },
    
      reducers: {
        settleList(state, action) {
          return {
            ...state,
            allSettleList:action.payload
          };
        },
        querySettleList(state, action) {
            return {
              ...state,
              queryListObj:action.payload,
            };
        },
        settleListDetail(state, action) {
          return {
            ...state,
            allSettleDetail:action.payload,
          };
      },
      },
    };
    