/**
 * 
 * @description 项目说明 商品明细列表管理Table组件
 * @author  lvyongjian
 * @warning  
 * 
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Slider, Card, Icon, Table, Button, message } from 'antd';
import { routerRedux } from 'dva/router';
import request from '../../utils/request';
import styles from '../System/Table.less';
import myUtil from '../../utils/myutil';//引入公共类，保存本地数据
// const lists  = [];
// for (let index = 0; index < 52; index++) {
// 	lists.push({
// 		name:"测试",
// 		mobile:"18665007653",
// 		company:"广东一站网络科技有限公司",
// 		companyName:"刘武",
// 		addr: "东风中路",
// 		createTime:"2018-11-12 12:12:32",
// 		regi: '微信'
// 	})
	
// }
@connect(({ incrementProduct, loading}) => ({
  data1:incrementProduct
}))
export default class GoodsDetailListTable extends PureComponent {
  state = {
    // listdata:[],
		selectedRowKeys:[],
	};

  // 首次进入加载列表
  componentDidMount() {
    this.props.onRef(this);
		// this.setState({listdata: lists});
	//页面初始化时，订阅事件
    // this.queryList({"currentPage":this.state.page,"pagesize":this.state.pageSize});
  }
  // 退出页面前卸载事件订阅，防止多次绑定多次触发查询问题
  componentWillUnmount() {
    console.log('componentWillUnmount unsubscribe')
	//PubSub.unsubscribe('COND_CHANGED');
  }
  componentWillReceiveRrops() {
  }
  componentWillUpdate() {
  }
  
  //设置selectedRowKeys为空，提供父组件使用
  setSelectedRowKeys(){
    this.setState({selectedRowKeys:[]});
  }
	
	/**
   * 每当勾选或者反选某一行前面的checkbox框后执行的方法
   */
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
 
    this.setState({ selectedRowKeys });
  }
  /**
   * 表单变化的事件，是从父组件传递的函数进来
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
    this.setState({ selectedRowKeys:[] });//点击分页时清空列表选项
  }
  /**
   * 清除选择的所有内容 
   */
  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

	//切记：传递给子组件的方法要以箭头函数为方式，变量名的形式传递。不能直接传方法
  refreshList=(data) => {
		console.log("这是添加编辑的数据")
		console.log(data.data.list)
		this.setState({listdata:data.data});
		}

  //渲染表格
  render() {
		const { loading, pagination, columns } = this.props;
		// const listData = this.props.data.customerList.list;
		const listData = this.props.data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
			// size:"small",
			...pagination,
    };

		// const pagination = {...paginationProps, ...this.state.pagination1};
		const {selectedRowKeys} = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.handleRowSelectChange,
			getCheckboxProps: record => ({
					disabled: record.disabled,
			}),
		};
		const refreshListMethods={
      setList:this.dispList
    }
    return (
		  <div className={styles.standardTable}>
				<Table
					rowKey={record => record.goodsItemId}
					refreshList={refreshListMethods}
					loading={this.props.loading}
					dataSource={listData}
					columns={columns}
					pagination={paginationProps}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={pagination}
          scroll={{ x: 1300 }}
          size='small'
				/>
		  </div>
    );
  }
}
