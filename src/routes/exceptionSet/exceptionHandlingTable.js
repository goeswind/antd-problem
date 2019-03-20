/**
 * 
 * @description 项目说明  结算管理
 * @author  DMY
 * @Date 2018.11.27
 * @warning  
 * 
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table,Modal, Row, Col, Form, Card,Drawer, Select, DatePicker,Button, Icon, Avatar, List, Tooltip, Dropdown, Menu, message,Input } from 'antd';
import styles from './index.less';
import myutil from '../../utils/myutil';
const { TextArea } = Input;
const { RangePicker } =DatePicker
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ exception, loading }) => (   
  {
  data: exception,
  tableData:exception.queryTableList,
  selectBigException: exception.selectBigException,
  selectMinException: exception.selectMinException,
  selectAllMinException: exception.allMinException,
  loading: loading.effects['exception/queryList'],  
}))
export default class exceptionHandlingTable extends PureComponent {
  state = {  
    current:1,//当前页
    pageSize:10,//每页显示多少条    
    isAdd:1,//1 新建 2 修改 3处理异常 4作废
    visible:false,//是否显示对话框    
    selectSmallException:[],//异常小类下拉框
    titleModal:"新建异常",
    rowSelectData: "",//当前选中行数据
    selectedRowKeys: '',//交易列表第几页
    allSelectedRowKey:[], //多选框
    editData:"",//编辑数据  
    expandForm:false,//高级搜索是否展开     
  }

  //搜索查询handleSubmit
	handleSubmit = (e) => {       
    let _this=this
    this.props.form.validateFields((err, values) => {                              
      if (err) {
        return      
      }
      
      const params={       
        current: "1",
        size: this.state.pageSize,
        ExceptionId:values.ExceptionId==undefined?"":values.ExceptionId,
        minExceptionType:values.minExceptionType==undefined?"":values.minExceptionType,
        orderSn:values.orderSn==undefined?"":values.orderSn
      }  
      if(values.dataTime != undefined){
        if(values.dataTime.length == 2){
          let startTime = myutil.date.format(values.dataTime[0]._d,"yyyy-MM-dd")+" 00:00:00"
          let endtime = myutil.date.format(values.dataTime[0]._d,"yyyy-MM-dd")+" 23:59:59"             
          params.startTime=startTime
          params.endtime=endtime
        }
      }
      
     const {dispatch} = this.props         
      dispatch({
        type: 'exception/queryList',
        payload: params,
        callback: (data) => {                
          if(!data.isSuccess){
            message.error("查询列表失败")
          }
        },
      });
         
    });
  }


  //查询
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    this.onChange('startValue', value);
  }
  onEndChange = (value) => {
    this.onChange('endValue', value);
  }
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }

  //选中表格圆点，当前列触发的事件
	handleRowSelectChange = (selectedRowKeys, selectedRows)=>{
		this.setState({
      allSelectedRowKey:selectedRowKeys, //存放多个选框
      rowSelectData : selectedRows[0],      
    })
  }
  
  //生产搜索表单
	renderSimpleForm(editType){
    const { getFieldDecorator } = this.props.form;
    const {selectAllMinException} =this.props              
    return(
      <div className={styles.dbHead}>
      <Form onSubmit={this.handleSubmit} layout="inline">   
        <FormItem label="异常编号">
        {getFieldDecorator('ExceptionId')(           
              <Input style={{width:150}} ></Input>          
            )}         
        </FormItem>
        <FormItem label="单号">
        {getFieldDecorator('orderSn')(             
              <Input placeholder="运单/订单/客户单号" style={{width:150}}></Input>           
        )}         
        </FormItem>
        <FormItem label="异常类型">
        {getFieldDecorator('minExceptionType')(           
              <Select style={{ width: '170px'}}>                                       
                 {selectAllMinException}  
              </Select>
        )}         
        </FormItem>
        {this.state.expandForm?
        <FormItem label="登记时间">
        {getFieldDecorator('dataTime')(          
             <RangePicker  style={{ width: 204}}  placeholder={['开始日期', '结束日期']} />        
        )}         
        </FormItem>
        :""}
       {this.state.expandForm?"":         
          <span  style={{ float: 'right'}}>
            <Button type="primary" htmlType="submit" >查询</Button>
            <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
            </a> 
          </span>         
        }  
        <div className={styles.allBtn}>
          <Button type="primary" onClick={this.addException}>新增</Button>&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.editException}>编辑</Button>&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.exceptionHandling}>处理</Button>&nbsp;&nbsp;&nbsp;           
          <Button type="primary" onClick={this.cancellation}>作废</Button>&nbsp;&nbsp;&nbsp;           
          {this.state.expandForm?
          <span  style={{ float: 'right'}}>
          <Button type="primary" htmlType="submit" >查询</Button>
          <Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
          </a> 
          </span> 
          :""}          
      </div>
      </Form>
      </div>
    )
  }
  //重置表单
	handleFormReset = () => {
    const { form  } = this.props;
    form.resetFields();        
  }
  
  //异常处理
  exceptionHandling =()=>{
    this.setModal(2);
  }
  //新增异常信息
  addException=()=>{        
    this.props.form.resetFields();
      this.setState({
        visible: true,
        isAdd:1,
        editData:""
      });
  }
  //编辑异常信息
  editException=()=>{           
    this.setModal(1)
  }

   setModal = (type)=>{ 
    let rowSelectData = this.state.rowSelectData
    if(rowSelectData == ""){
      message.warn("请选中行")
      return
    }    
    let id = rowSelectData.typeParentId
    this.props.form.resetFields(['cancelReason','orderNo','customerOrderNo','name1','name2','problemDesc','handleDesc']);
    this.bigExceptionChange(id,2,rowSelectData.typeId);
    this.props.form.setFieldsValue({
      name2: rowSelectData.name2,
    });
    
     if(type == 1){
      if(rowSelectData.dataSource != "10" || rowSelectData.state != 3){
        message.warn("只能修改待处理且来源于后台登记的异常")
        return 
      }      
      this.setState({
        isAdd:2,
        visible:true,      
        editData:rowSelectData,
        titleModal:"修改异常"
      })
     }else if(type == 2){
      if(rowSelectData.state != 3){
        message.warn("只能处理待处理的异常单")
        return 
      }
      this.setState({
        isAdd:3,
        visible:true,      
        editData:rowSelectData,
        titleModal:"处理异常"
      })
     }else{
      if(rowSelectData.dataSource != "10" || rowSelectData.state != 3){
        message.warn("只能修改待处理且来源于后台登记的异常")
        return 
      }
      this.setState({
        isAdd:4,
        visible:true,      
        editData:rowSelectData,
        titleModal:"作废异常"
      })
     }    
   }

  //保存
  okHandle=(e)=>{    
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }    
      debugger  
      let type = this.state.isAdd
      let data = this.state.editData
      let _id = data.id
      let params=""
      let msg=""
      let urlType=""      
      if(type == 1){           
         params = {
          orderNo:values.orderNo,
          customerOrderNo:values.customerOrderNo,
          typeId:values.name2,//小类id
          problemDesc:values.problemDesc,
          dataSource:"10"
        }
        msg="新增异常单成功"
        urlType='exception/saveExceptionHanding'
      }else if(type == 2){     
         
        params = {
          id:_id,
          typeId:values.name2,//小类id
          problemDesc:values.problemDesc
        }        
        msg="修改异常单成功"
        urlType="exception/updateExceprionHanding"
      }else if(type == 3){
       
        params = {
          id:_id,
          handleDesc:values.handleDesc
        }
        msg="处理异常单成功"
        urlType="exception/updateExceprionHanding"
      }else if(type == 4){
       
        params = {
          id:_id,
          cancelReason:values.cancelReason
        }
        msg="作废异常单成功"
        urlType="exception/cancelExceptionHanding"
      }
      this.save(urlType,params,msg);    
    });
  }

  save=(urlType,params,msg)=>{
    const { dispatch } = this.props; 
      dispatch({
        type: urlType,
        payload: params,
        callback: (bigDataList) => {              
          if(bigDataList.isSuccess){
            message.success(msg)                
          }else{
            message.error("保存异常单失败 原因:"+bigDataList.msg)
          } 
          this.setState({
            visible: false,
          });
          let isAdd = this.state.isAdd  
          debugger
          if(isAdd == 1){
            this.props.queryList(
              {
                current:1,
                siz:this.state.pageSize
              }
            )
          }else{              
            //编辑后的刷新
            this.handleSubmit();
          }
         
          },                               
      });
  } 
  closeModalVisible = (e) => {
    this.setState({
      visible: false,
    });
  }
  //异常大类的联调-获取异常小类
  bigExceptionChange=(value,type,name)=>{      
    //清空异常小类的值    
    this.props.form.resetFields(['name2'])
    const { dispatch } = this.props; 
    let params = {
      "parentid":value
    }    
    dispatch({
      type: 'exception/getSelectMinException',
      payload: params,
      callback:(bigDataList) => {                 
        if(!bigDataList.isSuccess){
          messgae.error("获取异常小类失败")
        }else{
          if(type== 2){
          this.props.form.setFieldsValue({
            name2:name,
          });
         }
        }
      }                
    });
  }
 //点击展开
 toggleForm = () => {
  this.setState({
    expandForm: !this.state.expandForm,
  });
  }
  
  //作废
  cancellation=()=>{
    this.setModal(3)
  }
  //分页
  onSelectChange=(selectedRowKeys)=>{
    let params={
      current:selectedRowKeys,
      size:this.state.bigPageSize,
    }
    const { dispatch } = this.props; 
    dispatch({
      type: 'exception/queryList',
      payload: params,
      callback: (data) => {                
        if(!data.isSuccess){
          message.error("查询列表失败")
        }
      },
    });   
  }
  
  render() {
    const {tableData} = this.props        
    const columns = [     
      { title: '异常编号', width: 160, dataIndex: 'id', key: 'id', fixed: 'left'},
      { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
      { title: '客户单号', dataIndex: 'customerOrderNo', key: 'customerOrderNo' },
      { title: '会员手机号', dataIndex: 'mobile', key: 'mobile' },
      { title: '异常大类', dataIndex: 'name1', key: 'name1' },
      { title: '异常小类', dataIndex: 'name2', key: 'name2' },
      { title: '异常描述', dataIndex: 'problemDesc', key: 'problemDesc' },
      { title: '处理描述', dataIndex: 'handleDesc', key: 'handleDesc' },
      { title: '异常状态',  key: 'state' ,
       render: (data) => {
        let html = "-"
         if(data.state == 3){
           html="新建"
         }else if(data.state == 9){
          html="已处理"
         }else if(data.state == 0){
          html="作废"
         }
         return html
       },
    },
      { title: '异常来源', key: 'dataSource',
      render: (data) => {
        let html = "-"
         if(data.dataSource == "01"){
           html="小程序下单"
         }else if(data.dataSource == "02"){
          html="pc端下单"
         } else if(data.dataSource == "03"){
          html="APP下单"
         }else if(data.dataSource == "10"){
          html="客服登记"
         }        
         return html
       },
     },
      { title: '登记日期', dataIndex: 'createTime', key: 'createTime' },
    ];
   
    //交易列表分页
    const paginationProps = {
      total:tableData.total==undefined?0:tableData.total,
      onChange: this.onSelectChange
    };   
    //列表行选中
		const rowSelection = {
      onChange: this.handleRowSelectChange,
      type:"radio",
			selectedRowKeys:this.state.allSelectedRowKey,
    };
    const formItemLayout = {
      labelCol: {
        sm: { span:7 },
      },
      wrapperCol: {
        sm: { span: 17 },
      },
    };
    const styleItem={style:{marginBottom:8}};    
    const {loading,selectBigException,selectMinException} =this.props        
    const { getFieldDecorator } = this.props.form;
    const {isAdd,editData} = this.state
   // const bigException = selectBigException.map(bigException => <Option key={bigException.key}>{bigException.value}</Option>);
    return (
      <div className={styles.settleTable}>
        <div className={styles.settleForm}>
          {this.renderSimpleForm()}
        </div>      
        <Table
        loading={loading}
        rowKey={record => record.id} 
        columns={columns} 
        dataSource={tableData.records==undefined?"":tableData.records} 
        scroll={{ x: 1100 }}
        rowSelection={rowSelection}
        pagination={paginationProps}
        size='small'
        /> 
         <Modal          
            style={{ top: 20 }}
            title={this.state.titleModal}
            okText="保存"
            visible={this.state.visible}
            width={600}
            onOk={this.okHandle}
            onCancel={this.closeModalVisible}
         > 
          <Row gutter={24}>        
            <Col span={12}>
            {this.state.isAdd == 4?
            <FormItem 
                label={"作废理由"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('cancelReason', {
                    rules: [{ required: true, message: '请填写作废理由' }],
                    initialValue:''                                 
                    })(
                      <Input/>
                    )}
            </FormItem>:""}
            </Col>        
          </Row> 
        <Row gutter={24}>        
            <Col span={12}>
            {this.state.isAdd != 4?
            <FormItem 
                label={"订单号"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('orderNo', {
                    rules: [{ required: true, message: '请填写订单号' }],
                    initialValue:editData=="" ?"" :editData.orderNo                                  
                    })(
                      <Input disabled={isAdd==1?false:true} />
                    )}
            </FormItem>
            :""}
          </Col>
          <Col span={12}>
          {this.state.isAdd != 4?
            <FormItem 
                label={"客户单号"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('customerOrderNo', {
                    rules: [{ required: false, message: '' }],
                    initialValue:editData=="" ?"" :editData.customerOrderNo                                  
                    })(
                      <Input disabled={isAdd==1?false:true} />
                    )}
            </FormItem>
            :""}
          </Col>
        </Row>        
        <Row gutter={24}>
          <Col span={12}>
          {this.state.isAdd != 4?
          <FormItem 
                label={"异常大类"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('name1', {
                    rules: [{ required: true, message: '请选择异常大类' }],
                    initialValue:editData=="" ?"" :editData.typeParentId                                 
                    })(
                      <Select disabled={isAdd!=3?false:true}  style={{ width: '100%' }} onChange={this.bigExceptionChange}>                                                                                                 
                      {selectBigException}
                    </Select>
                    )}
            </FormItem>
            :""}
            </Col>
            <Col span={12}>
            {this.state.isAdd != 4?
            <FormItem 
                label={"异常小类"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('name2', {
                    rules: [{ required: true, message: '请选择异常小类' }],
                    initialValue:''
                    })(
                      <Select disabled={isAdd!=3?false:true}  style={{ width: '100%' }} onChange={this.bigExceptionChange}>                                                                                                 
                        {selectMinException}
                       </Select>
                    )}
            </FormItem>
            :""}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
          {(this.state.isAdd == 1 ||this.state.isAdd == 2)?
          <FormItem 
                label={"异常描述"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('problemDesc', {
                    rules: [{ required: true, message: '请填写异常描述' }],
                    initialValue:editData=="" ?"" :editData.problemDesc                                     
                    })(
                      <TextArea />
                    )}
            </FormItem>
            :""}
          {this.state.isAdd == 3?
            <FormItem 
                label={"异常描述"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('problemDesc', {
                    rules: [{ required: true, message: '请填写异常描述' }],
                    initialValue:editData=="" ?"" :editData.problemDesc                                       
                    })(
                      <Input disabled={true} />
                    )}
            </FormItem>
            :""}       
            </Col>
            <Col span={12}>
            {this.state.isAdd != 3?"":
            <FormItem 
                label={"处理描述"}
                {...formItemLayout}
                {...styleItem}
                >
                {getFieldDecorator('handleDesc', {
                    rules: [{ required: true, message: '请填写处理描述' }],
                    initialValue:editData=="" ?"" :editData.handleDesc                                    
                    })(
                      <TextArea />
                    )} 
            </FormItem>
           }
          </Col>
        </Row>
         </Modal>            
      </div>
    );
  }
}