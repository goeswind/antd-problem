import { carsTypeQueryList,carsDetail } from '../services/myManagement';

export default {
    namespace: 'carsTypeManagement',

    state: {
        carsTypeManagementList: [],
        carsTypeList: [],//商品管理--车型类型
        queryListObj:{
            size: "", //每页显示条数 number
            current: "", //当前页 number
            startime: "",
            endtime:"",
        }
      },
    
      effects: {
        // put 是用来发起一条action
        // call 是以异步的方式调用函数
        // select 是从state中获取相关的数据
        // take获取发送的数据
        //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
        //然后在里面返回state等数据
        
        //商品管理--商品列表查询
        //请求列表的参数，每次查询列表的时候先在model层保存好查询参数，再发起请求
          *saveQueryCarsType({ payload, callback }, { call, put,select }) {
            let response = yield select((state) => {return state.carsTypeManagement.queryListObj})
            //将payload的内容替换response里有的内容
            let sendData=Object.assign(response,payload)
            yield put({
              type: 'QueryCarsTypeSave',
              payload: sendData
            })
            if (callback) callback(sendData)
          },
          //请求列表
          *queryCarsType({ payload, callback }, { call, put,select }) {
            const sendData = yield select((state) => {return state.carsTypeManagement.queryListObj})
            const response = yield call(carsTypeQueryList, sendData);
            yield put({
              type: 'saveCarsTypeList',
              payload: response,
            });
            if (callback) callback(response);
          },
      },
    
      reducers: {
        saveCarsTypeList(state, action) {
          return {
            ...state,
            carsTypeManagementList:action.payload
          };
        },
        QueryCarsTypeSave(state, action) {
            return {
              ...state,
              queryListObj:action.payload,
            };
        },
      },
    };
    