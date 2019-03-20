import { stringify } from 'qs';
import request from '../utils/request';

//商品管理--商品管理列表
export async function goodsQueryList(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goods/list', options);
}

//商品管理--主商品详细信息查询
export async function queryGoodsByID(params){
  let options = {
    method: 'GET',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    // body: params,
  };
  return request('/admin/goods/info?goodsId='+params['goodsId'], options);
}

//商品管理--根据主商品名（市-市）查询特惠线路信息
export async function queryLineByCity(params){
  let options = {
    method: 'GET',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    // body: params,
  };
  return request('/admin/activityLine/queryLineByCity?bcityCode='+params['bcityCode']+'&ecityCode='+params['ecityCode'], options);
}

//商品管理--主商品上架请求
export async function goodsUp(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goods/up', options);
}

//商品管理--主商品下架请求
export async function goodsDown(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goods/down', options);
}

//商品管理--主商品删除请求
export async function goodsDelete(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goods/delete', options);
}

//商品管理--主商品修改保存请求
export async function goodsEdit(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goods/edit', options);
}

//商品管理--明细商品列表
export async function goodsItemQueryList(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goodsItem/list', options);
}

//商品管理--明细商品详细信息查询
export async function queryGoodsItemByID(params){
  let options = {
    method: 'GET',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    // body: params,
  };
  return request('/admin/goodsItem/info?goodsItemId='+params['goodsItemId'], options);
}

//商品管理--根据明细商品名（市区-市区）查询特惠线路信息
export async function queryLineByCityAndDistrict(params){
  let options = {
    method: 'GET',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    // body: params,
  };
  return request('/admin/activityLine/queryLineByCityAndDistrict?bcityCode='+params['bcityCode']+'&bdistrictCode='+params['bdistrictCode']+'&ecityCode='+params['ecityCode']+'&edistrictCode='+params['edistrictCode'], options);
}

//商品管理--明细商品上架请求
export async function goodsItemUp(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goodsItem/up', options);
}

//商品管理--明细商品下架请求
export async function goodsItemDown(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goodsItem/down', options);
}

//商品管理--明细商品删除请求
export async function goodsItemDelete(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goodsItem/delete', options);
}

//商品管理--明细商品修改保存请求
export async function goodsItemEdit(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/goodsItem/edit', options);
}

//商品管理--明细商品--根据明细商品查询计费规则
export async function queryBillmodelList(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/product/billmodel/list', options);
}