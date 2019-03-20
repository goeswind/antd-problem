import { stringify } from 'qs';
import request from '../utils/request';

export async function delApp(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/api/system/deleteByPrimaryKey', options);

  // return request('/api/system/deleteByPrimaryKey', {
  //   method: 'POST',
  //   body: params,
  // });
}

export async function delUser(params) {
  return request('/api/system/delUser', {
    method: 'POST',
    body: params,
  });
}

export async function delOrg(params) {
  return request('/api/system/delOrg', {
    method: 'POST',
    body: params,
  });
}

export async function delRole(params) {
  return request('/api/system/delRole', {
    method: 'POST',
    body: params,
  });
}

export async function delMenu(params) {
  return request('/api/system/delMenu', {
    method: 'POST',
    body: params,
  });
}
//添加应用系统
export async function saveApp(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/api/system/insert', options); 
}

export async function saveUser(params) {
  return request('/api/system/saveUser', {
    method: 'POST',
    body: params,
  });
}

export async function saveOrg(params) {
  return request('/api/system/saveOrg', {
    method: 'POST',
    body: params,
  });
}

export async function saveRole(params) {
  return request('/api/system/saveRole', {
    method: 'POST',
    body: params,
  });
}

export async function saveMenu(params) {
  return request('/api/system/saveMenu', {
    method: 'POST',
    body: params,
  });
}
//应用管理列表请求
export async function queryAppList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/api/system/list', options); 
}

export async function queryUserList(params) {
  return request('/api/system/queryUserList', {
    method: 'POST',
    body: params,
  });
}

export async function queryOrgList(params) {
  return request('/api/system/queryOrgList', {
    method: 'POST',
    body: params,
  });
}

export async function queryRoleList(params) {
  return request('/api/system/queryRoleList', {
    method: 'POST',
    body: params,
  });
}

export async function queryMenuList(params) {
  return request('/api/system/queryMenuList', {
    method: 'POST',
    body: params,
  });
}
