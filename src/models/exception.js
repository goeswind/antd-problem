import { saveHandingService,exceptionHandlingTable,getSelectExceptionService,queryExceptionListService,deleteExceptionService,saveExceptionService,updateExceptionService,updateHandingService,cancelHandingService } from '../services/myManagement';
export default {
    namespace: 'exception',

    state: {
        queryTableList:"",//查询列表
        selectBigException:[],//异常大类下拉 
        selectMinException:[],//异常大类下拉         
        allMinException:[],//所有异常小类
        state:""//订单状态
      },
    
      effects: {
        // put 是用来发起一条action
        // call 是以异步的方式调用函数
        // select 是从state中获取相关的数据
        // take获取发送的数据
        //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
        //然后在里面返回state等数据        
          /* 异常处理 */    
          //异常处理 - 请求列表
          *queryList({ payload, callback }, { call, put,select }) {                                                          
            if(payload.state != undefined){
              yield put({
                type: 'changeState',
                payload: payload.state,
              }); 
            }else{
              let state = yield select((state) => {return state.exception.state})              
              payload.state = state
            }             
            const response = yield call(exceptionHandlingTable, payload);                                                              
            if(response.isSuccess){
              yield put({
                type: 'queryDataList',
                payload: response.data,
              }); 
            }  
                      
            if (callback) callback(response);
          },         
          //获取异常大类下拉
          *getSelectException({ payload, callback }, { call, put,select }) {                                    
            const response = yield call(getSelectExceptionService,payload); 
            let selectData=[]            
            for(let value of response.data.records){    
              selectData.push(<Option value={value.id}>{value.name}</Option>);
            }                                                         
            yield put({
              type: 'getSelectBigException',
              payload: selectData,
            });
            if (callback) callback(response);
          },
          //获取异常大类下拉
          *getSelectMinException({ payload, callback }, { call, put,select }) {                                    
            const response = yield call(getSelectExceptionService,payload); 
            let selectData=[]            
            for(let value of response.data.records){    
              selectData.push(<Option value={value.id}>{value.name}</Option>);
            }                                                         
            yield put({
              type: 'getSelectMinExceptionReducers',
              payload: selectData,
            });
            if (callback) callback(response);
          },
          //获取所有异常小类
          *getAllBigException({ payload, callback }, { call, put,select }) {                                              
            const response = yield call(getSelectExceptionService,payload);                         
            let selectData=[]            
            for(let value of response.data.records){    
              selectData.push(<Option value={value.id}>{value.name}</Option>);
            }                                                                     
            yield put({
              type: 'selectAllMinException',
              payload: selectData,
            });
            if (callback) callback(response);
          },
          //新增        
           *saveExceptionHanding({ payload, callback }, { call, put,select }) { 
             debugger                                 
            const response = yield call(saveHandingService,payload);            
            if (callback) callback(response);
          },
          //修改   
          *updateExceprionHanding({ payload, callback }, { call, put,select }) {                                  
            const response = yield call(updateHandingService,payload);            
            if (callback) callback(response);
          },
          //作废
          *cancelExceptionHanding({ payload, callback }, { call, put,select }) {                                  
            const response = yield call(cancelHandingService,payload);            
            if (callback) callback(response);
          },

          /* 异常维护 */
           //查询异常大类的列表
           *queryBigExceptionList({ payload, callback }, { call, put,select }) {                                              
            const response = yield call(queryExceptionListService,payload);                                                                   
            if (callback) callback(response);
          }, 
          //查询异常小类的列表
          *queryMinExceptionList({ payload, callback }, { call, put,select }) {                                              
            const response = yield call(queryExceptionListService,payload);                                                           
           if (callback) callback(response);
         },
          //新增异常
          *saveException({ payload, callback }, { call, put,select }) {                                  
            const response = yield call(saveExceptionService,payload);            
            if (callback) callback(response);
          },
           //修改异常
           *updateException({ payload, callback }, { call, put,select }) {                                  
            const response = yield call(updateExceptionService,payload);            
            if (callback) callback(response);
          },
          //删除异常大类
          *deleteException({ payload, callback }, { call, put,select }) {                                  
            const response = yield call(deleteExceptionService,payload);            
            if (callback) callback(response);
          }
          
      },
    
      reducers: {
        queryDataList(state, action) {          
          return {
            ...state,
            queryTableList:action.payload
          };
        },
      
        getSelectBigException(state, action) {
          return {
            ...state,
            selectBigException:action.payload,
          };
         }, 
         
         getSelectMinExceptionReducers(state, action) {
          return {
            ...state,
            selectMinException:action.payload,
          };
         }, 

          selectAllMinException(state, action) {
          return {
            ...state,
            allMinException:action.payload,
          };
         }, 

         changeState(state, action) {
          return {
            ...state,
            state:action.payload,
          };
         }, 
                  
      },
    };
    