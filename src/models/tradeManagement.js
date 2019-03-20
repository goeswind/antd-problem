import { queryOrderList, queryListVehicleType, queryListProductName, switchItemId, queryCalcTotal } from '../services/tradeManagement';
import { queryByPcodes } from '../services/api';

export default {
  namespace: 'tradeManagement',

  state: {
    currentUser: {},
    orderList: [],//交易管理 -- 订单列表
    dictData: {},//交易管理 -- 车辆、货物等公共资料
    vhcTypeList: [],//交易管理 -- 车型列表数据
    productList:[],//交易管理 -- 产品信息列表
    goodsInfo:{},//交易管理 -- 商品详细信息
    calcTotalInfo:{},//交易管理 -- 下单计费信息
  },

  effects: {
    // put 是用来发起一条action
    // call 是以异步的方式调用函数
    // select 是从state中获取相关的数据
    // take获取发送的数据
    //当我们使用put发送一条action的时候 与之对于的reducers就会接收到这个消息，
    //然后在里面返回state等数据
    
    //交易管理 -- 订单列表查询
    *queryOrderList({ payload, callback }, { call, put }) {
      const response = yield call(queryOrderList, payload);
      yield put({
        type: 'saveOrderList',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //交易管理 -- 车型列表查询
    *queryListVehicleType({ payload, callback }, { call, put }) {
      const response = yield call(queryListVehicleType, payload);
      yield put({
        type: 'saveVhcTypeList',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //交易管理 -- 获取车辆、货物等公共资料
    *queryByPcodes({ payload, callback }, { call, put }) {
      const response = yield call(queryByPcodes, payload);
      yield put({
        type: 'saveDictData',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //交易管理 -- 获取产品信息列表数据
    *queryListProductName({ payload, callback }, { call, put }) {
      const response = yield call(queryListProductName, payload);
      yield put({
        type: 'saveProductList',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //交易管理 -- 获取商品详细信息数据
    *switchItemId({ payload, callback }, { call, put }) {
      const response = yield call(switchItemId, payload);
      yield put({
        type: 'saveGoodsInfo',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
    //交易管理 -- 获取下单计费信息数据
    *queryCalcTotal({ payload, callback }, { call, put }) {
      const response = yield call(queryCalcTotal, payload);
      yield put({
        type: 'saveCalcTotalInfo',
        payload: response?response.data:[],
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    saveOrderList(state, action) {
      return {
        ...state,
        orderList:action.payload,
      };
    },
    saveVhcTypeList(state, action) {
      return {
        ...state,
        vhcTypeList:action.payload,
      };
    },
    saveDictData(state, action) {
      return {
        ...state,
        dictData:action.payload,
      };
    },
    saveProductList(state, action) {
      return {
        ...state,
        productList:action.payload,
      };
    },
    saveGoodsInfo(state, action) {
      return {
        ...state,
        goodsInfo:action.payload,
      };
    },
    saveCalcTotalInfo(state, action) {
      return {
        ...state,
        calcTotalInfo:action.payload,
      };
    },
  },
};
