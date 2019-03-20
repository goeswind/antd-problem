import { stringify } from 'qs';
import request from '../utils/request';

/**********商品管理 - 车型图片管理************/
//商品管理--车型图片列表查询
export async function carsTypeQueryList(params){
    let options = {
      method: 'POST',
      // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      headers:{'Content-Type': 'application/json'},
      body: params,
    };
    return request('/admin/cartype/page', options);
}

//商品管理--车型图片修改
export async function carsUpdate(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/cartype/update', options);
}

//车型图片删除
export async function carsDelete(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/cartype/delete', options);
}
//车型图片新建
export async function carsInsert(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/cartype/insert', options);
}

//商品管理--车型类型
export async function carsTypeId(params){
  let options = {
    method: 'post',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    body: params,
  };
  return request('/admin/tbBaseDropdown/queryByPcode', options);
}

//商品管理--车型详细信息查询
export async function carsDetail(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/cartype/info/get', options);
}
/**********商品管理 - 车型图片管理************/

/**********结算管理 - 车型图片管理************/
//结算列表查询
export async function settleTableList(params){
  let options = {
    method: 'POST',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/orderBill/page', options);
}
//账单明细分页查询
export async function detailOrderBill(params){
  let options = {
    method: 'POST',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/orderBill/detailOrderBill', options);
}
//确认结算
export async function updateBillState(params){
  let options = {
    method: 'GET',
  };
  return request('/admin/orderBill/updateBillState?id='+params['id'], options);
}
/**********结算管理************/
//交易列表分页查询
export async function tradeTableList(params){
  let options = {
    method: 'POST',
    // headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/order/transactionList', options);
}
//支付订单记录
export async function tradeTableDetail(params){
  let options = {
    method: 'GET',
    // headers:{'Content-Type': 'application/json'},
    // body: params,
  };
  return request('/admin/order/queryPayRecordByOrderId?id='+params['id'], options);
}
//交易列表导出
export async function tradeExportExcel(params){
  let options = {
    method: 'GET',
  };
  return request('/admin/order/exportExcel?pageNumber='+params['pageNumber']+'&pageSize='+params['pageSize']+'&startime='+params['startime']+'&endtime='+params['endtime'], options);
}
/**********发票管理************/
//发票列表分页查询
export async function invoiceTableList(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/invoice/orderItemPage', options);
}
//开票剩余库存
export async function invoiceResidual(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/invoice/invoiceStock', options);
}
//我的发票信息-列表-tab
export async function orderItemPageTab(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/invoice/orderItemPageTab', options);
}
//全部发票
export async function invoiceNum(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/invoice/pageTab', options);
}
//发票详情
export async function orderItemInvoiceDetail(params){
  let options = {
    method: 'POST',
    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
    // headers:{'Content-Type': 'application/json'},
    body: params,
  };
  return request('/admin/invoice/orderItemInvoiceDetail', options);
}
//发送电子邮件
export async function sendEmail(params) {
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:params,
      }; 
return request('/admin/invoice/sendEmail', options); 
}
//发票作废---已开票才能作废
export async function disableOrderItemInvoice(params) {
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:params,
      }; 
return request('/admin/invoice/disableOrderItemInvoice', options); 
}
//发票取消
export async function cancleOrderItemInvoice(params) {
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:params,
      }; 
return request('/admin/invoice/cancleOrderItemInvoice', options); 
}
//实收确认
export async function receiveMoneyFn(params) {
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:params,
      }; 
return request('/admin/invoice/receiveMoney', options); 
}
//发票记录删除
export async function invoiceDeleteFn(params) {
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:params,
      }; 
return request('/admin/invoice/delete', options); 
}
//异常处理-获取异常下拉
export async function getSelectExceptionService(params) {
      let options = {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:params,
      }; 
      return request('/admin/problem/base/list', options);             
   
}
//查询异常列表
export async function queryExceptionListService(params) {  
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:params,
      }; 
  return request('/admin/problem/base/list', options);      
}
//新增异常
export async function saveExceptionService(params) {  
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:params,
      }; 
  return request('/admin/problem/base/save', options);      
}
//修改异常大类
export async function updateExceptionService(params) {  
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:params,
      }; 
  return request('/admin/problem/base/update', options);      
}
//删除异常大类
export async function deleteExceptionService(params) {  
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:params,
      }; 
  return request('/admin/problem/base/delete', options);      
}

//异常处理-exception handling
export async function exceptionHandlingTable(params) {
  let options = {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body:params,
      }; 
  return request('/admin/problem/list', options); 
    
  }
  //异常处理 -添加异常
  export async function saveHandingService(params) {
    let options = {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body:params,
        }; 
    return request('/admin/problem/save', options);      
  }
    //异常处理 -异常修改
    export async function updateHandingService(params) {
      let options = {
          method:'POST',
          headers:{'Content-Type': 'application/json'},
          body:params,
          }; 
      return request('/admin/problem/update', options);      
    }
    //异常订单作废
    export async function cancelHandingService(params) {
      let options = {
          method:'POST',
          headers:{'Content-Type': 'application/json'},
          body:params,
          }; 
      return request('/admin/problem/cancel', options);      
    }