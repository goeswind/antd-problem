/**
 * 
 * @description 项目说明  管理--管理
 * @author    hcf  2019//
 * @warning   
 * 
 */
import React, { PureComponent } from 'react'; //引入react
import { connect } from 'dva'; //引入dva
import { Row, Col, Card, Form,
    Badge,Input, Select, Icon, 
    Button, message,Modal,Cascader,
    Table,Drawer,DatePicker } from 'antd';//引入antd控件
import { routerRedux } from 'dva/router'; //引入redux
// import {} from '../../services/api';引入请求接口函数
import styles from './index.less';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@Form.create()
//导入model层
@connect(({ example, loading}) => ({
    loading: loading.effects['example/queryList'],
    dataList: example,
}))

//暴露example类
export default class example extends PureComponent {
    //当前模块公共的数据管理的地方->state
    state = {
        tableList:[
            {t0:"20190101",t1:"张学友",t2:"Charlie puth",t3:"杨釺嬅",t4:"river flows in you",t5:"We Don't Talk Anymore"},
            {t0:"20190201",t1:"张学友",t2:"Charlie puth",t3:"杨釺嬅",t4:"river flows in you",t5:"We Don't Talk Anymore"},
            {t0:"20190301",t1:"张学友",t2:"Charlie puth",t3:"杨釺嬅",t4:"river flows in you",t5:"We Don't Talk Anymore"},
            {t0:"20190401",t1:"张学友",t2:"Charlie puth",t3:"杨釺嬅",t4:"river flows in you",t5:"We Don't Talk Anymore"},
            {t0:"20190501",t1:"张学友",t2:"Charlie puth",t3:"杨釺嬅",t4:"river flows in you",t5:"We Don't Talk Anymore"},
            {t0:"20190601",t1:"张学友",t2:"Charlie puth",t3:"杨釺嬅",t4:"river flows in you",t5:"We Don't Talk Anymore"},
        ],//表格数据
        selectedRowKeys:[],//当前选中表格行
        isModal:false,//弹窗开关
        
    };
    // 首次进入加载列表，即生命周期为组件加载完后执行
    componentDidMount() {
        // this.queryList({
        //     current:1,
        //     size:10
        // });
    }
    queryList(params) {
        const { dispatch } = this.props; 
        dispatch({
            type: 'example/saveQueryProData',
            payload: params,
            callback: () => {
            //将请求参数保存在model在发起请求
                dispatch({
                    type: 'example/queryList',
                    callback: () => {
                        this.dispList();
                    },
                });
            },
        });
    }
    dispList = ()=> {
        console.log(this.props.dataList.modelList)
        const cache = this.props.dataList.modelList.data?this.props.dataList.modelList.data:[];
        this.setState({tableList:cache});
    }
    //清除选中行的key
    cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys:[]
        })
    };
    //选中表格圆点，当前列触发的事件
    handleRowSelectChange=(selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys:selectedRowKeys,        //保存当前行的key
        })
    }
    //分页器触发更新表格
    onSelectChange = (selectedRowKeys) => {
        let sendData={
            current:selectedRowKeys,
            size:10
        }
        const { dispatch } = this.props; 
        this.cleanSelectedKeys()
        this.queryList(sendData)
    }
        /**
   * 简单的查询表格框 内容
   */
  renderSimpleForm(){
    const { getFieldDecorator } = this.props.form;
    const styleItem={style:{marginBottom:16}};
    return(
      <Form onSubmit={this.handleSearch} layout="inline">
              <FormItem 
               {...styleItem}
              label="名称">
                {getFieldDecorator('ctitle')(
                  <Input placeholder="名称" />
                )}
              </FormItem>
              <FormItem 
               {...styleItem}
              label="状态">
                {getFieldDecorator('csta345te')(
                  <Select  style={{width:'100%',minWidth:'150px'}}>
                    <Option value="">全部</Option>
                    <Option value="1">启用</Option>
                    <Option value="2">停用</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem 
               {...styleItem}
              label="时间">
                {getFieldDecorator('213')(
                    <RangePicker allowClear={true} placeholder={['开始时间', '结束时间']}  format={"YYYY/MM/DD"}/>
                )}
              </FormItem>
              <FormItem 
               {...styleItem}
              >
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a> */}
              </span>
              </FormItem>
      </Form>
    );
    }
    render() {
        const { resetFields, getFieldDecorator } = this.props.form;
        const form = this.props.form;
        const columns = [
            {
              title: '我是一个标题',
              dataIndex: 't1',
              width:150,
            //   fixed:'left'
            },
            {
              title: '我是一个标题',
              dataIndex: 't2',
              width:150,
            },
            // {
            //   title: '我是一个标题',
            //   dataIndex: 't3',
            //   width:150,
            //   render: (text, record,index) => {
            //     const eleType=['未确认','已确认']
            //     // 状态，0-未确认（客户可取消），1-已确认（不允许客户再取消）
            //     return (
            //       <span>
            //           {record.state>3?(<a style={{paddingRight:15}} onClick={() => this.handleErrorDetail(record)}>{eleType[record.state]}</a>):(eleType[record.state])}
            //       </span>
            //     )
            //   }
            // },
            
        ]
        const rowSelection = {
            onChange: this.handleRowSelectChange,
            type:"radio",
            selectedRowKeys:this.state.selectedRowKeys
        };
        const paginationProps = {
            // showSizeChanger: true,
            total:this.state.tableList.length!=0?this.state.tableList.total:"",
            // showQuickJumper: true,
            onChange:this.onSelectChange
            // ...pagination,
        };
        const btnSize={size:'default'}
        const formItemLayout = {
            labelCol: {
              sm: { span: 10 },
            },
            wrapperCol: {
              sm: { span: 14 },
            },
          };
        const clearRule = () =>{
            console.log('触发了清空')
            //重置控件状态
            resetFields()
        }
        const closeModalVisible = () =>{
            this.setState({
                isModal:false,
            })
        }
        const okHandle = () => {
            form.validateFields(['selectdemo','timedemo','inputdemo','textbox'],(err, fieldsValue) => {
                  if (err) return;

                })//这个validateFields结束的标签
        }
        return(
            <div className={styles.contentWrap}>
            <Card >
                {this.renderSimpleForm()}
                <div className={styles.btnWrap}>
                        <Button icon="plus"  {...btnSize} type="primary" onClick={() => openModalVisible("1")}>
                            新增
                        </Button>  
                        <Button icon="edit"  {...btnSize}  onClick={() => openModalVisible("2",rowSelectData)}>
                            修改
                        </Button>
                        <Button icon="delete"  {...btnSize}  onClick={() => openModalVisible("2",rowSelectData)}>
                            删除
                        </Button>
                </div>
                <div>
                    <Table
                    loading={this.props.loading}
                    // rowKey={record => record.key}
                    rowSelection={rowSelection}
                    dataSource={this.state.tableList?this.state.tableList:[]}
                    columns={columns}
                    pagination={paginationProps}
                    // onChange={this.handleTableChange}
                    size='small'
                    scroll={{y: 285}}
                    />
                </div>
                <Modal
                    afterClose={clearRule} 
                    style={{ top: 20 }}
                    title={'我是标题'}
                    okText="保存"
                    visible={this.state.isModal}
                    width={450}
                    onOk={okHandle}
                    onCancel={() => closeModalVisible()}
                    >
                        <Form>
                            <FormItem 
                                label={'名称'}
                                {...formItemLayout}
                                >
                                {getFieldDecorator('inputdemo', {
                                        rules: [{ 
                                            required: true,
                                            message:"请输入名称"
                                        }],
                                        // initialValue:this.state.titleType==2?rowSelectData.productType:"",
                                    })(
                                        <Input placeholder="名称" />
                                    )}
                            </FormItem>
                            <FormItem 
                                label={'名称'}
                                {...formItemLayout}
                                >
                                {getFieldDecorator('selectdemo', {
                                        rules: [{ 
                                            required: true,
                                            message:"请输入名称"
                                        }],
                                        // initialValue:this.state.titleType==2?rowSelectData.productType:"",
                                    })(
                                        <Select >
                                            <Option value="">全部</Option>
                                            <Option value="1">选项一</Option>
                                            <Option value="2">选项二</Option>
                                            <Option value="3">选项三</Option>
                                        </Select>
                                    )}
                            </FormItem>
                            <FormItem 
                                label="时间"
                                {...formItemLayout}
                            >
                                    {getFieldDecorator('timedemo',{
                                    rules: [{ 
                                        required: true,
                                        message:"请选择时间"   
                                    }],
                                    // initialValue:this.state.titleType==2?[moment(rowSelectData.startValidDate, 'YYYY/MM/DD'),moment(rowSelectData.endValidDate, 'YYYY/MM/DD')]:null,
                                    })(
                                        <RangePicker  placeholder={['开始日期', '结束日期']} />
                                    )}
                            </FormItem> 
                            <FormItem 
                                label="文本框"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('textbox')(
                                    <TextArea  maxLength="200" rows={4} cols={100} placeholder="文本框"/>
                                )}
                            </FormItem>
                        </Form>
                </Modal>
            </Card>
            </div>
        )
    }
}