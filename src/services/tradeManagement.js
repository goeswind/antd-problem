import { stringify } from 'qs';
import request from '../utils/request';

//交易管理 -- 订单列表查询
export async function queryOrderList(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/order/page', options);
}

//交易管理 -- 车型列表查询
export async function queryListVehicleType(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  // return request('/admin/goodsItem/listVehicleType', options);
  return request('/admin/goodsItem/listVehicleTypeV2', options);//修改接口，如果三级线路不符合则查询二级线路
}

//交易管理 -- 产品列表查询
export async function queryListProductName(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/goodsItem/listProductName', options);
}

//交易管理 -- 商品详情(切换goodsItemId)（下单前请求）
export async function switchItemId(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/goodsItem/switchItemId', options);
}

//交易管理 -- 下单计费接口查询（下单前请求）
export async function queryCalcTotal(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/orderprice/calcTotal', options);
}

//交易管理 -- 订单列表管理--订单下单请求
export async function orderCreater(params){
  let options = {
    method: 'POST',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/order/creater', options);
}

//交易管理--订单列表管理--订单取消请求
export async function orderDelete(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/order/delete', options);
}

//交易管理--订单列表管理--订单明细查询
export async function orderItemDetail(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/order/findOrderDetail', options);
}

//交易管理--订单列表管理--根据订单号查询订单请求
export async function queryOrderInfo(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/order/findOrderDetailForUpdate', options);
}

//交易管理--订单列表管理--订单修改请求
export async function orderEdit(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/order/modify', options);
}
