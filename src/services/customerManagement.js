import { stringify } from 'qs';
import request from '../utils/request';

//客户管理--客户管理列表
export async function queryCustomerList(params){
  let options = {
    method: 'POST',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/usermenber/page', options);
}

//客户管理--客户管理修改
export async function customerManagementEdit(params){
  let options = {
     method: 'POST',
   //  headers:{'Content-Type': 'application/x-www-form-urlencoded'},
     headers:{'Content-Type': 'application/json'},
     body: params,
  };
  return  request('/admin/usermenber/updatestate', options);
 // return request('/admin/usermenber/updatestate?id='+params['id']+'&state='+params['state']+'&messages='+params['msgType01']+'&systemMsgs='+params['msgType02'], options);
}