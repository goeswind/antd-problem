import request from '../utils/request';

//获取子树
export async function subTree(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/tbBaseDropdown/subTree', options);
}
//启用、禁用
export async function enabled(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/tbBaseDropdown/enabled', options);
}
//新增或修改
export async function addOrUpdate(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/tbBaseDropdown/addOrUpdate', options);
}
//查询单条
export async function get(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/tbBaseDropdown/get', options);
}
//查询单条
export async function doDelete(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    //headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/tbBaseDropdown/delete', options);
}
