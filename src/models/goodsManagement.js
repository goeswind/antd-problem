import { goodsQueryList,queryGoodsByID,goodsItemQueryList,queryGoodsItemByID,queryLineByCity,queryLineByCityAndDistrict,
    queryBillmodelList} from '../services/goodsManagement';

export default {
  namespace: 'goodsManagement',

  state: {
    currentUser: {},
    goodsList: [],//商品管理--商品列表
    modalGoods:false,//商品管理--修改商品信息弹出框
    goodsDetail:{},//商品管理--主商品详细信息
    goodsItemList:[],//商品管理--明细商品列表
    goodsItemDetail:{},//商品管理--明细商品详细信息
    lineByCityList:[],//商品管理--主商品特惠线路列表
    lineByCityAndDistrictList:[],//商品管理--明细商品特惠线路列表
    billmodelList:[],//商品管理--明细商品--计费规则信息列表
  },

  effects: {
    // put 是用来发起一条action
    // call 是以异步的方式调用函数
    // select 是从state中获取相关的数据
    // take获取发送的数据
    //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
    //然后在里面返回state等数据
    
    //商品管理--商品列表查询
    *goodsQueryList({ payload, callback }, { call, put }) {
      const response = yield call(goodsQueryList, payload);
      yield put({
        type: 'saveGoodsList',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
    //商品管理--修改商品信息弹出框
    *modalGoods({payload,callback},{put,call,select}){
      const response = yield select((state) => {return state.goodsManagement.modalGoods})
      yield put({
          type: 'changeGoods',
          payload: !response
      }); 
    },
     //商品管理--主商品详细信息查询
     *queryGoodsByID({ payload, callback }, { call, put }) {
      const response = yield call(queryGoodsByID, payload);
      yield put({
        type: 'saveGoodsDetail',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
    //商品管理--商品列表查询
    *goodsItemQueryList({ payload, callback }, { call, put }) {
      const response = yield call(goodsItemQueryList, payload);
      yield put({
        type: 'saveGoodsItemList',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
     //商品管理--明细商品详细信息查询
     *queryGoodsItemByID({ payload, callback }, { call, put }) {
      const response = yield call(queryGoodsItemByID, payload);
      yield put({
        type: 'saveGoodsItemDetail',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
     //商品管理--主商品特惠线路查询
     *queryLineByCity({ payload, callback }, { call, put }) {
      const response = yield call(queryLineByCity, payload);
      yield put({
        type: 'saveLineByCityList',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
     //商品管理--明细商品特惠线路查询
     *queryLineByCityAndDistrict({ payload, callback }, { call, put }) {
      const response = yield call(queryLineByCityAndDistrict, payload);
      yield put({
        type: 'saveLineByCityAndDistrictList',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
     //商品管理--明细商品--计费规则列表查询
     *queryBillmodelList({ payload, callback }, { call, put }) {
      const response = yield call(queryBillmodelList, payload);
      yield put({
        type: 'saveBillmodelList',
        payload: response?response.data:[]
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveGoodsList(state, action) {
      return {
        ...state,
        goodsList:action.payload,
      };
    },
    changeGoods(state,action){
      return {
        ...state,
        modalGoods:action.payload
      }
    },
    saveGoodsDetail(state,action){
      return {
        ...state,
        goodsDetail:action.payload
      }
    },
    saveGoodsItemList(state,action){
      return {
        ...state,
        goodsItemList:action.payload
      }
    },
    saveGoodsItemDetail(state,action){
      return {
        ...state,
        goodsItemDetail:action.payload
      }
    },
    saveLineByCityList(state,action){
      return {
        ...state,
        lineByCityList:action.payload
      }
    },
    saveLineByCityAndDistrictList(state,action){
      return {
        ...state,
        lineByCityAndDistrictList:action.payload
      }
    },
    saveBillmodelList(state,action){
      return {
        ...state,
        billmodelList:action.payload
      }
    },
  },
};
