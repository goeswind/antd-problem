import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Divider, Menu, InputNumber, DatePicker, Radio, Modal, message } from 'antd';
import { routerRedux } from 'dva/router';
import AuditVarietyMaterialTable from '../../components/System/AppTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import request from '../../utils/request';

import styles from './index.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item; 
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  // console.log('我就是props')
  // console.log(props)
  const okHandle = () => {
    //检验输入值是否正确
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新增应用系统"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="应用名称："
      >
        {form.getFieldDecorator('appName', {
          rules: [{ required: true, message: '请输入应用系统名称...' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="应用编码："
      >
        {form.getFieldDecorator('appCode', {
          rules: [{ required: true, message: '请输入应用系统编码...' }],
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
    </Modal>
  );
});
@connect(({ system, loading}) => ({
  loading: loading.models.system,
  data: system, 
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,  //新建规则界面开关 
    selectedRows: [],
    formValues: {},
	  curAuditStatus: 'all', //当前审核状态
	  page: 1,
	  pageSize: 10,
    listdata:''
  };
  // 首次进入加载列表
  componentDidMount() {
    this.queryList({"page":this.state.page,"pageSize":this.state.pageSize});
    // console.log(this.props)
  }

  queryList =(params) =>{
    const { dispatch } = this.props; 
    dispatch({
      type: 'system/queryAppList',
      payload:params,
  	  callback: () => {
  		  this.dispList();
  	  },
    });
    // console.log("参数是"+params)
  }

  dispList() {
    	const cache = this.props.data.list.data;
       // console.log(cache)
    	this.setState({listdata:cache});
  }
  //添加新建内容
  handleAdd = (fields) => {
    console.log(fields)
    this.props.dispatch({
      type: 'system/saveApp',
      payload:{
                "src":JSON.stringify(fields)
              },
      callback:(data)=>{
            console.log(data)
            if (data.code==200){
                message.success('添加成功');
                console.log("开始请求")
                this.queryList({"page":this.state.page,"pageSize":this.state.pageSize})
                this.setState({
                  modalVisible: false,
                });
                console.log(this.props)
            }
        }
    });

  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
 //    const { dispatch } = this.props;
 //    const { formValues } = this.state;

 //    const filters = Object.keys(filtersArg).reduce((obj, key) => {
 //      const newObj = { ...obj };
 //      newObj[key] = getValue(filtersArg[key]);
 //      return newObj;
 //    }, {});

 //    const params = {
 //      currentPage: pagination.current,
 //      pageSize: pagination.pageSize,
 //      ...formValues,
 //      ...filters,
 //    };
 //    if (sorter.field) {
 //      params.sorter = `${sorter.field}_${sorter.order}`;
 //    }

	// this.queryList(params);
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
	this.queryList({});
  }

  //点击查询
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    // console.log(this.props)
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.appName===undefined){
        message.error("请输入内容！")
      }else{
        let sendData={"appName":fieldsValue.appName}
        // console.log(sendData)
        this.props.dispatch({
            type: 'system/queryAppList',
            payload:{"src":JSON.stringify(sendData),"page":this.state.page,"pageSize":this.state.pageSize},
            callback:(data)=>{
                  console.log("请求下来啦")
                  this.dispList();
            }
        });
      }
      
    });
  }

  onChange=(e) => {
	this.state.curAuditStatus = e.target.value;
    // console.log(this.state.curAuditStatus);
	this.dispList();
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    //注意这里的getFieldDecorator('xxx')方法，传入参数就是输入参数的“键”值
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="应用系统名称">
              {getFieldDecorator('appName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  rowOperCallback=(rowdata, opertype) => {
    // console.log('opertype: '+opertype);
  	if(opertype==='view') {

  	} else if(opertype==='download') {

  	} else if(opertype==='batchupdate') {

  	}
    const { dispatch } = this.props;
  	dispatch({
  		type: 'swap/saveRowOper',
  		payload: {rowdata: rowdata, opertype:opertype},
  	});
  	dispatch(routerRedux.push('/swap/auditmaterial/audit'));
    }

  del = () => {
    const { dispatch, form } = this.props;
  	let rows = this.state.selectedRows;;
  	let ids = rows.map(row => row.id).join(',');
  	//删除后刷新列表数据 
  	dispatch({
  		type: 'material/removeVarietyMaterial',
  		payload: {
  			ids: ids
  		}
  	});
  }
  //新建内容展示界面
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
	// const { dispatch } = this.props;
	// this.props.dispatch(routerRedux.push('/material/variety/step-form'));
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {loading } = this.props;
    const { selectedRows,modalVisible } = this.state;
    console.log(this.props)
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    }; 
    const listdata=this.state.listdata
	const gridStyle = {
	  width: '50%',
	  textAlign: 'center',
	};
    return (
      <Row gutter={24}>
		<Col xl={12} lg={24} md={24} sm={24} xs={24}>
		  <Row gutter={24}>
			<Col xl={24} lg={24} md={24} sm={24} xs={24}>
			  <Form onSubmit={this.handleSearch} layout="inline">
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
				  <Col md={12} sm={24}>
					<FormItem label="统计周期">
					  {getFieldDecorator('cycle')(
						<Input placeholder="请输入" />
					  )}
					</FormItem>
				  </Col>
				  <Col md={12} sm={24}>
					<FormItem label="客户">
					  {getFieldDecorator('custName')(
						<Input placeholder="请输入" />
					  )}
					</FormItem>
				  </Col>
				</Row>
			  </Form>
			</Col>
		  </Row>
		  <Divider style={{ margin: '10px 0 10px' }} />
		  <Row gutter={24}>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="订单量" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="吨量" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				
			</Col>
		  </Row>
		  <Divider style={{ margin: '10px 0 10px' }} />
		  <Row gutter={24}>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="平均录单时间" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="平均调单时间" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="平均提货时间" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
		  </Row>
		  <Divider style={{ margin: '10px 0 10px' }} />
		  <Row gutter={24}>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="每小时公里数" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				<Card title="平均回单时长" bordered={false}><div><span>1</span>单</div></Card>
			</Col>
			<Col xl={8} lg={24} md={24} sm={24} xs={24}>
				
			</Col>
		  </Row>
		</Col>
		<Col xl={12} lg={24} md={24} sm={24} xs={24}>
		  <Row gutter={24}>
			<Col xl={24} lg={24} md={24} sm={24} xs={24}>
			  <Form onSubmit={this.handleSearch} layout="inline">
				<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
				  <Col md={12} sm={24}>
					提货及时率 图形报表
				  </Col>
				  <Col md={12} sm={24}>
					到货及时率 图形报表
				  </Col>
				</Row>
			  </Form>
			</Col>
		  </Row>
		  <Divider style={{ margin: '10px 0 10px' }} />
		  <Row gutter={24}>
			<Col xl={24} lg={24} md={24} sm={24} xs={24}>
			  <Card title="运作异常：">
				  <Row gutter={24}>
					<Col xl={12} lg={24} md={24} sm={24} xs={24}>
						<Card title="应调未提" bordered={false}><div><span>1</span>单</div></Card>
					</Col>
					<Col xl={12} lg={24} md={24} sm={24} xs={24}>
						<Card title="应提未提" bordered={false}><div><span>1</span>单</div></Card>
					</Col>
				  </Row>
				  <Row gutter={24}>
					<Col xl={12} lg={24} md={24} sm={24} xs={24}>
						<Card title="应到未到" bordered={false}><div><span>1</span>单</div></Card>
					</Col>
					<Col xl={12} lg={24} md={24} sm={24} xs={24}>
						<Card title="应回未回" bordered={false}><div><span>1</span>单</div></Card>
					</Col>
				  </Row>
			  </Card>
			</Col>
		  </Row>
		</Col>
	  </Row>
    );
  }
}
