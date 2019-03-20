import { stringify } from 'qs';
import request from '../utils/request';

//api.js可以统一管理接口地址和请求参数
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  //return request('/api/login/account', {
  return request('/admin/shopSeller/login', {
    method: 'POST', 
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function registerHandle(params) {
  return request('/api/user/register', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryNotices() { 
  return request('/api/notices');
}
// -----------hcf-----------------------------------
//查询线路列表
export async function queryProductLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        // headers:{'Content-Type': 'application/json'},
        body:params,
        }; 
  return request('/admin/product/contract/page', options); 
}
//新增产品列表
export async function newProductLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/contract/add', options); 
}
//修改产品列表(产品已发布，不能修改 在商城)
export async function editProductLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/contract/update', options); 
}
//删除产品列表(产品已发布，不能删除在商城)
export async function delProductLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/contract/delete', options); 
}

//查询线路列表()
export async function queryLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/conline/page', options); 
}
//新增线路()
export async function newLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/conline/add', options); 
}
//修改线路()
export async function editLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/conline/update', options); 
}
//作废线路()
export async function delLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/conline/delete', options); 
}
//发布线路()
export async function openLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params, 
        }; 
  return request('/admin/product/conline/publish', options); 
}
//取消发布线路()
export async function cancelLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/conline/cancelPublish', options); 
}
//停用线路()
export async function stopLineList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/conline/release', options); 
}
//产品类型查询()
export async function searchProductType(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/contract/list', options); 
}

//查询计费规则列表
export async function queryCountingRule(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/billmodel/list', options); 
}
//新建计费规则
export async function addCountingRule(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/billmodel/add', options); 
}
//修改计费规则
export async function editCountingRule(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/billmodel/update', options); 
}
//删除计费规则
export async function delCountingRule(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/product/billmodel/delete', options); 
}

//获取公共资料1
export async function queryCommonData1(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/tbBaseDropdown/queryByCode', options); 
}
//获取公共资料2
export async function queryCommonData2(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/tbBaseDropdown/queryByPcode', options); 
}

//通过codes获取车辆公共资料，此方法支持传入多个code查询
export async function queryByPcodes(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/tbBaseDropdown/queryByPcodes', options); 
}


//查询增值服务列表
export async function queryIncrementList(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/vapproduct/conline/page', options); 
}
//增加增值服务
export async function addIncrement(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/vapproduct/conline/add', options); 
}
//编辑增值服务
export async function editIncrement(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/vapproduct/conline/update', options); 
}

//启用和停用增值服务
export async function openAstopIncrement(params) {
  let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/vapproduct/conline/updatestate', options); 
}

//待对账单查询列表接口
export async function orderCheckBillList(params) {
  return request(`/admin/orderCheckbill/listOrderForCheckbill?${stringify(params)}`);
}


//生成对账单
export async function orderCheckbillCreate(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/orderCheckbill/create', options); 
}
//对账单查询列表接口
export async function finishCheckBillList(params) {
  return request(`/admin/orderCheckbill/list?${stringify(params)}`);
}
//取消对账单
export async function cancelCheckBillList(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/orderCheckbill/cancel', options);
}
//新建发票信息
export async function invoiceTitleSave(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/invoiceTitle/save', options);
}

//查询对账单明细列表
export async function orderCheckbillMapping(params) {
  return request(`/admin/orderCheckbillMapping/list?${stringify(params)}`);
}
//消息管理保存接口
export async function inforSetupSave(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforSetup/save', options); 

}
//消息管理分页请求
export async function inforSetupPage(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforSetup/page', options); 

}
//消息管理详情请求
export async function inforSetupDetail(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforSetup/detail', options); 

}
//消息管理删除接口
export async function inforSetupDelete(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforSetup/delete', options); 
}
//请求发票抬头以及公司信息信息
export async function invoiceTitle(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/invoiceTitle/list', options); 
}
//开票信息保存接口
export async function saveOrderItemInvoice(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/invoice/saveOrderItemInvoice', options); 
}
//用户信息管理page
export async function inforReceiveuserPage(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforReceiveuser/page', options); 
}
//查询未读消息数量
export async function countUnRead(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforReceiveuser/countUnRead', options); 
}
//设置消息已读
export async function readCommit(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:params,
        }; 
  return request('/admin/infor/inforReceiveuser/readCommit', options); 
}

// -----------hcf-----------------------------------
