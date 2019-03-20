import { tradeTableList } from '../services/myManagement';

export default {
    namespace: 'transactionList',

    state: {
        tradeDataList: [],
        queryListObj:{
            pageSize: "", //每页显示条数 number
            pageNumber: "", //当前页 number
            param:{
                startime: '', //查询开始时间
                endtime: '',  //查询结束时间
            }
        }
      },
    
      effects: {     
        //交易管理--交易列表
        //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，再发起请求
          *saveQueryTradeList({ payload, callback }, { call, put,select }) {
            let response = yield select((state) => {return state.transactionList.queryListObj})
            //将payload的内容替换response里有的内容
            let sendData=Object.assign(response,payload)
            yield put({
              type: 'queryTradeList',
              payload: sendData
            })
            if (callback) callback(sendData)
          },
          //请求列表
          *saveTradeList({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.transactionList.queryListObj})
            const response = yield call(tradeTableList, sendData);
            yield put({
              type: 'tradeList',
              payload: response,
            });
            if (callback) callback(response);
          },
      },
    
      reducers: {
        tradeList(state, action) {
          return {
            ...state,
            tradeDataList:action.payload
          };
        },
        queryTradeList(state, action) {
            return {
              ...state,
              queryListObj:action.payload,
            };
        },
      },
    };
    