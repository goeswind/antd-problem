/**
 * 
 * @description 项目说明 增值产品管理   增值产品列表
 * @author    lvyongjian  hcf  2018.11.22
 * @warning   
 * 
 */
import React, { PureComponent } from 'react'; //引入react
import { connect } from 'dva'; //引入dva
import { Row, Checkbox,Col, Card, Form,Badge,Input, Select, Icon, Button, message,Modal,Cascader,Table,Drawer,DatePicker } from 'antd';//引入antd控件
import styles from './index.less';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
@Form.create()
//导入model层
@connect(({ exception, loading}) => ({
  loading: loading.effects['exception/queryBigExceptionList'],
  RuleTableing: loading.effects['exception/queryMinExceptionList'],
  data:exception
}))

//暴露产品列表类
export default class exceptionType extends PureComponent {
    constructor(props){
        super(props);
        this.state={
          isExceptionType:1,//1 是异常大类新增 2是异常小类新增 3 是大类修改 4.小类的修改 5.大类删除 6.小类的删除
          bigTableList:[],//异常大类列表
          bigTotal:'',//
          bigCurrent:'',
          bigPageSize:10,    
          selectedRowKeys:[],//异常大类选中行的数据   
          minSelectedRowKeys:[],// 异常小类选中行的数据 
          minTableList:[],//异常小类列表
          minTotal:'',//
          minCurrent:'',
          minPageSize:10,
          titleType:"新增异常大类",
          isBigModal:false,// 异常大类的弹框        
          bigSelectData:"",//选中异常大类保存的数据
          minSelectData:"",//选中异常小类保存的数据  
          bigEditData:"",//异常大类编辑对象  
          minEditData:"",//异常小类编辑对象  
        }
    }

    // 首次进入加载列表，即生命周期为组件加载完后执行
    componentDidMount() {
         this.queryList({
            current:1,
            size:this.state.bigPageSize,
            parentid:"0"
          });     
    }
    queryList(params) {            
        const { dispatch } = this.props; 
        dispatch({
            type: 'exception/queryBigExceptionList',
            payload: params,
            callback: (bigDataList) => {                                                        
              if(bigDataList.code ==200){                
                this.setState({
                  bigTableList:bigDataList.data.records,
                  bigTotal:bigDataList.data.total,
                  bigCurrent:bigDataList.data.current,
                  bigPageSize:bigDataList.data.size
                })                                
              }else{                
                message.error("获取异常大类失败")
              }
              },                               
        });
    }

    dispList = ()=> {
        console.log()
        const cache = this.props.data.incrementProductList.data?this.props.data.incrementProductList.data:[];
        this.setState({bigTableList:cache});
    }
    //刷新表单
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
    }
 
    //新增big
    addBigException=()=>{
      this.handleFormReset();
      this.setState({
        isBigModal:true,
        titleType:"新增异常大类",
        isExceptionType:1,
        bigEditData:""
     })
    }
    //修改big
    editBigException=()=>{
      let data =  this.state.bigSelectData
      if(data.length == 1){
          this.setState({
            isBigModal:true,
            bigEditData:data[0],
            titleType:"编辑异常大类",
            isExceptionType:3
          })
      }else{
        message.warn("请选择要修改的对象")
      }     
    }
    //删除big
    deleteBigException=()=>{
      let data =  this.state.bigSelectData
      let _this = this
      this.deteleConfirm(_this,data,5)
    }   
    deteleConfirm=(_this,data,type)=>{
      if(data.length == 1){
        confirm({
          title: '温馨提示',
          content: '你确认要删除当前记录吗?',
          okText:"确认",
          cancelText:"在想一下",
          onOk() {             
            _this.deteleException({id: data[0].id },type);
          },
          onCancel() {
              
          },
        });
      }else{
        message.warn("请选择要删除的对象")
      }   
    }

    deteleException=(params,type)=>{
      const { dispatch } = this.props;              
      dispatch({
          type: 'exception/deleteException',
          payload: params,
          callback: (bigDataList) => {              
            if(bigDataList.code ==200){
              message.success("删除异常成功")                
            }else{
              message.error("删除异常失败 原因:"+bigDataList.msg)
            }  
            if(type == 5){  
              // 重新查询异常大类 
              this.queryList({
                current:this.state.bigCurrent,
                size:this.state.bigPageSize,
                parentid:"0"
              }); 
              //清空信息
              this.setState({
                bigSelectData:"",
                minSelectData:"",
                selectedRowKeys:[],
                minSelectedRowKeys:[],
                bigEditData:"",
                minEditData:"",
                minTableList:[]
              })
            }else if(type == 6){   
              let id = this.state.bigSelectData[0].id                         
              this.queryMinList({
                current:this.state.bigCurrent,
                size:this.state.bigPageSize,
                parentid:id
              }); 
              this.setState({              
                minSelectData:"",            
                minSelectedRowKeys:[],            
                minEditData:""
              })
            }         
            this.setState({
              isBigModal:false
            })
            },                               
      });
    }

    okHandle=(e)=>{      
      let type = this.state.isExceptionType
      this.props.form.validateFields((err, values) => {
        if (err) {
          return
        }
       let  params={}
      if(type == 1 ){
         params = {
          name:values.bigExceptionName,
          parentid:"0"
        }
        this.okBigHandle(e,params,'exception/saveException',1);
      }else if(type == 2 ){               
        this.okMinHandle(e,values,'exception/saveException',2);
      }else if(type == 3 ){
        let bigSelectData = this.state.bigSelectData
        if(bigSelectData == "")  return          
        let _id = bigSelectData[0].id
         params = {
          name:values.bigExceptionName,
          id:_id
        }        
        this.okBigHandle(e,params,'exception/updateException',3);
      }else if(type == 4){
        this.okMinHandle(e,values,'exception/updateException',4);
      }
    })
    }
    //保存异常大类
    okBigHandle=(e,params,urlType,type)=>{      
        const { dispatch } = this.props;         
        dispatch({
            type: urlType,
            payload: params,
            callback: (bigDataList) => {              
              if(bigDataList.isSuccess){
                message.success("保存异常成功")                
              }else{
                message.error("保存异常失败")
              }   
              if(type == 1){
                this.queryList({
                  current:1,
                  size:this.state.bigPageSize,
                  parentid:"0"
                });  
              }else if(type == 3){
                this.queryList({
                  current:this.state.bigCurrent,
                  size:this.state.bigPageSize,
                  parentid:"0"
                });  
              }             
              this.setState({
                isBigModal:false
              })
              },                               
        });     
    }
    //保存异常小类
    okMinHandle=(e,values,urlType,type)=>{      
      let params = {
        name:values.minExceptionName,
        manageGuide:values.manageGuide,
        recordGuide:values.recordGuide,            
      }
        let selectData = ""
        let parentid = ""
        let _id = "0"
        selectData = this.state.bigSelectData
        if(selectData == "") return
         _id = selectData[0].id
         parentid = selectData[0].id
        if(type == 2){         
          params.parentid = _id
        }else{
          selectData = this.state.minSelectData
          if(selectData == "") return
           _id = selectData[0].id
          params.id=_id
        }
        const { dispatch } = this.props; 
        let showData = values.showGroup        
        for(let data of showData){
          if(data == "isUsePc"){
            params.isUsePc = 1
          }else if(data == "isUseSmallapp"){
            params.isUseSmallapp =1
          }else if(data == "isUseAdmin"){
            params.isUseAdmin =1
          }
        }   
           
        dispatch({
            type: urlType,
            payload: params,
            callback: (bigDataList) => {              
              if(bigDataList.code ==200){
                message.success("保存异常成功")                
              }else{
                message.error("保存异常失败")
              }                              
              if(type == 2){         
                this.queryMinList({
                  current:1,
                  size:this.state.bigPageSize,
                  parentid:parentid
                });  
              }else if(type == 4)  {
                this.queryMinList({
                  current:this.state.minCurrent,
                  size:this.state.bigPageSize,
                  parentid:parentid
                });  
              }
              this.setState({
                isBigModal:false
              })
              },                               
        });
     
    }
    //取消保存异常大类
    closeBigModalVisible=()=>{
      this.setState({
        isBigModal:false,
     })
    }
    //新增min
    addMinException=()=>{    
      let data =  this.state.bigSelectData   
      if(data.length == 1){
        this.handleFormReset();
        this.setState({
          isBigModal:true,
          titleType:"新增异常小类",
          isExceptionType:2,
          minEditData:""
         })     
      }else{
        message.warn("请先选中异常大类")
      }
    }
    //修改min
    editdMinException=()=>{
      let data =  this.state.minSelectData
      if(data.length == 1){
         //处理下展示端
      let showArr = []
      if(data[0].isUseAdmin == 1){//后台
        showArr.push("isUseAdmin")
      }
      if(data[0].isUsePc == 1){//PC
        showArr.push("isUsePc")
      }
      if(data[0].isUseSmallapp == 1){//小程序
        showArr.push("isUseSmallapp")
      }
      data[0].showGroup=showArr      
        this.setState({
          isBigModal:true,
          minEditData:data[0],
          titleType:"编辑异常小类",
          isExceptionType:4
        })
    }else{
      message.warn("请选择要修改的对象")
    }  
    }
    //删除min
    deletedMinException=()=>{
      let data =  this.state.minSelectData
      let _this = this      
      this.deteleConfirm(_this,data,6)
    }
    //选择大类表单后的变话
    handleRowSelectChange=(selectedRowKeys, selectedRows)=>{
      this.setState({
        bigSelectData:selectedRows,
        selectedRowKeys:selectedRowKeys    
      })          
      let parentid = selectedRows[0].id
      let params = {
        current:1,
        size:this.state.minPageSize,
        parentid:parentid
      } 
      this.queryMinList(params)   
    }
    queryMinList=(params)=>{
      const {dispatch} = this.props
      dispatch({
        type: 'exception/queryMinExceptionList',
        payload: params,
        callback: (minDataList) => {              
          if(minDataList.code ==200){
            this.setState({
              minTableList:minDataList.data.records,
              minTotal:minDataList.data.total,
              minCurrent:minDataList.data.current,
              minPageSize:minDataList.data.size                     
            })                                
          }else{
            message.error("获取异常小类列表失败")
          }
          },                               
    });
    }
    //点击异常小类行
    minHandleRowSelectChange=(selectedRowKeys, selectedRows)=>{      
      this.setState({
        minSelectData:selectedRows,
        minSelectedRowKeys:selectedRowKeys    
      })   
    }
    //异常大类的分页
    onSelectChange = (selectedRowKeys) =>{
      this.queryList({
        current:selectedRowKeys,
        size:this.state.bigPageSize,
        parentid:"0"
      }); 
    }
    //异常小类的分页
    onSelectChangeMin = (selectedRowKeys) =>{
      let bigSelectData = this.state.bigSelectData
      if(bigSelectData == "") { 
        messge.error("请选择异常大类")
        return
      }         
      let _id = bigSelectData[0].id
      this.queryList({
        current:selectedRowKeys,
        size:this.state.bigPageSize,
        parentid:_id
      }); 
    }

    
    //渲染页面
    render() {
      const { resetFields,getFieldDecorator} = this.props.form;
      const{bigEditData,minEditData} = this.state
        const formItemLayout = {
          labelCol: {
            sm: { span: 6 },
          },
          wrapperCol: {
            sm: { span: 18 },
          },
        };
        const bigColumns = [           
            {
              title: '异常大类',
              dataIndex: 'name',
              width:150,
            },
            {
              title: '修改时间',
              dataIndex: 'updateTime',
              width:150,
            },          
        ]

        const minColumns = [               
                {
                  title: '异常小类',
                  dataIndex: 'name',
                  width:150,                
                },
                {
                  title: '登记指引',
                  dataIndex: 'recordGuide',
                  width:150,                
                },
                {
                  title: '处理指引',
                  dataIndex: 'manageGuide',
                  width:150,                
                },
                {
                  title: '显示端',                
                  width:150,                
                  render: (data) => {
                   let html = ""
                    if(data.isUseAdmin == 1){
                      html+="后台管理 ,"
                    } 
                    if(data.isUsePc == 1){
                      html+="用户PC端 ,"
                    } 
                    if(data.isUseSmallapp == 1){
                      html+="用户小程序端 ,"
                    }
                    return html
                  },
  
                },
                {
                  title: '修改时间',
                  dataIndex: 'updateTime',
                  width:150,                
                },
                
          ]
          const showOption = [
            { label: '用户PC端', value: "isUsePc" },
            { label: '用户小程序', value: "isUseSmallapp" },
            { label: '管理后台', value: "isUseAdmin" },
        ];
        //每次关闭弹出层都将state里得单条数据缓存清空
        const clearRule = () =>{
          console.log('触发了清空')
          //重置控件状态
          resetFields()
        }      
        //选中表格后执行
        const rowSelection = {
            onChange: this.handleRowSelectChange,
            type:'radio',           
            selectedRowKeys:this.state.selectedRowKeys
        };

        // 小类
        const  minRowSelection ={
          onChange: this.minHandleRowSelectChange,
          type:'radio',           
          selectedRowKeys:this.state.minSelectedRowKeys
        }
      //异常大类的分页
        const paginationProps = {
          total:this.state.bigTotal,
          onChange:this.onSelectChange
        };         
        const  minPagination={
          total:this.state.minTotal,
          onChange:this.onSelectChangeMin
        }
    
        return(
            <div className={styles.contentWrap}>
            <Card >
               {/*  {this.renderSimpleForm()} */}
                    <div className={styles.btnWrap}>
                        <Button icon="plus"  type="primary" onClick={this.addBigException}>
                            新增
                        </Button>  
                        <Button icon="edit"   onClick={this.editBigException}>
                            修改
                        </Button>
                        <Button icon="delete" onClick={this.deleteBigException}>
                            删除
                        </Button>
                    </div>
                    <div>
                        <Table
                            loading={this.props.loading}
                            rowKey="uid01"
                            rowSelection={rowSelection}
                            dataSource={this.state.bigTableList}
                            columns={bigColumns}
                            pagination={paginationProps}
                           // onChange={this.handleTableChange}
                            size='small'
                            scroll={{y: 285}}
                            />
                    </div>
                    <legend>异常小类</legend>                    
                    <div className={styles.btnWrap}>
                        <Button icon="plus"  type="primary" onClick={this.addMinException}>
                            新增
                        </Button>  
                        <Button icon="edit" onClick={this.editdMinException}>
                            修改
                        </Button>
                        <Button icon="delete"  onClick={this.deletedMinException}>
                            删除
                        </Button>
                    </div>
                    <div>
                        <Table
                            loading={this.props.RuleTableing}
                            rowKey="uid01"
                            rowSelection={minRowSelection}
                            dataSource={this.state.minTableList}
                            columns={minColumns}
                            pagination={minPagination}
                           // onChange={this.handleMinTableChange}
                            scroll={{ x: 2500,y: 285}}
                            size='small'
                            />
                    </div>
                   <Modal
                        afterClose={clearRule} 
                        style={{ top: 20 }}
                        title={this.state.titleType}
                        okText="保存"
                        visible={this.state.isBigModal}
                        width={450}
                        onOk={this.okHandle}
                        onCancel={this.closeBigModalVisible}
                    >   
                        <Form>                          
                        <Row gutter={24}>                             
                          <Col span={24}>    
                          {(this.state.isExceptionType == 1 || this.state.isExceptionType == 3)?
                            <FormItem 
                                label={'分类名称'}
                                {...formItemLayout}
                                >
                                {getFieldDecorator('bigExceptionName', {
                                        rules: [{ 
                                            required: true,
                                            message:"请输入分类名称"
                                        }],
                                        initialValue:bigEditData!=""?bigEditData.name:''
                                    })(
                                      <Input placeholder="请输入分类名称" />
                                    )}
                            </FormItem>   
                               :""}
                          </Col>
                                        
                        </Row> 
                    
                                                                     
                        <Row gutter={24}> 
                        <Col span={24}>
                        {(this.state.isExceptionType == 2 || this.state.isExceptionType == 4)?                      
                          <FormItem 
                              label={'分类名称'}
                              {...formItemLayout}
                              >
                              {getFieldDecorator('minExceptionName', {
                                      rules: [{ 
                                          required: true,
                                          message:"请输入分类名称"
                                      }],
                                      initialValue:minEditData!=""?minEditData.name:''
                                  })(
                                    <Input placeholder="请输入分类名称" />
                                  )}
                          </FormItem>   
                          :""}                     
                        </Col>
                      </Row>
                        <Row gutter={24}> 
                      <Col span={24}> 
                      {(this.state.isExceptionType == 2 || this.state.isExceptionType == 4)?                      
                        <FormItem 
                            label={'登记指引'}
                            {...formItemLayout}
                            >
                            {getFieldDecorator('recordGuide', {
                                    rules: [{ 
                                        required: false,
                                        message:"请输入登记指引"
                                    }],
                                    initialValue:minEditData!=""?minEditData.recordGuide:''
                                })(
                                  <Input placeholder="登记指引" />
                                )}
                        </FormItem> 
                        :""}                       
                      </Col>
                    </Row>
                        <Row gutter={24}> 
                    <Col span={24}>   
                    {(this.state.isExceptionType == 2 || this.state.isExceptionType == 4)?                     
                      <FormItem 
                          label={'处理指引'}
                          {...formItemLayout}
                          >
                          {getFieldDecorator('manageGuide', {
                                  rules: [{ 
                                      required: false,
                                      message:"请输入处理指引"
                                  }],
                                  initialValue:minEditData!=""?minEditData.manageGuide:''
                              })(
                                <Input placeholder="处理指引" />
                              )}
                      </FormItem> 
                       :""}                                 
                    </Col>
                    </Row>
                    
                        <Row gutter={24}>                        
                          <Col span={24}>  
                          {(this.state.isExceptionType == 2 || this.state.isExceptionType == 4)?                                        
                            <FormItem 
                                label={'展示端'}
                                {...formItemLayout}
                                >
                                {getFieldDecorator('showGroup', {
                                        rules: [],
                                        initialValue:minEditData!=""?minEditData.showGroup:''
                                    })(
                                      <CheckboxGroup options={showOption}  />
                                      )}
                            </FormItem>    
                              :""}                                               
                          </Col>                             
                        </Row>   
                     
                      </Form>                    
                    </Modal>                                       
            </Card>
            </div>
        )
    }
}