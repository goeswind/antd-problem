import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Popconfirm } from 'antd';
import styles from './Table.less';
import myutil from '../../utils/myutil';
import request from '../../utils/request';

const statusMap = ['default', 'processing', 'success', 'error'];
@connect(({ material, loading }) => ({
  material,
  loading: loading.models.material,
}))
class VarietyMaterialTable extends PureComponent {
  state = {
    selectedRowKeys: [],
	  data:[]
  };

  componentDidMount() {
	//进入列表页面时，清除业务主键缓存，防止新建表单页也会查询绑定数据
	 myutil.store.remove('busiId');
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: []
      });
    }
	  this.cacheData = this.state.data.map(item => ({ ...item }));
  }
  //选择列表触发的事件
  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('选择啦')
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    // this.props.onChange(pagination, filters, sorter);
    console.log('分页器跳转啦')
    console.log(pagination)
  }
  //清除全选
  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  del(index) {
    console.log("删除该行")
    console.log(index)
    console.log(this.props.data.list)
    let sendData=this.props.data.list[index].id
    this.props.dispatch({
            type: 'system/delApp',
            payload:{
              "src":JSON.stringify({"id":sendData})
            },
            callback:(data)=>{
              console.log(data)
                  console.log("请求下来啦")
                  this.queryList({"page":1,"pageSize":10});
            }
    });
  }

  queryList(params) {
      console.log('这是删除方法')
      console.log(this.props)
      this.props.freshList(params)
  }

  update(record) {
	//TODO 暂时无法实现跳转uri带参数方式实现跳转，并接收请求参数这种推荐的方式，先用store缓存实现，后面有空再改进
	//缓存当前记录主键id，方便跳转到的表单页获取该id值，20秒过期
	// myutil.store.set('busiId', record.id, 20);
	// const { dispatch } = this.props;
	// //跳转表单页，进行编辑数据
	// const uri = '/material/variety/step-form?varietyid='+record.id;
	// //const uri = '/material/variety/step-form/'+record.id;
	// console.log('update to uri: '+uri);
	// this.props.dispatch(routerRedux.push(uri));
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    console.log('这是子组件的的props')
    console.log(this.props)
    const listData =this.props.data.list
    const columns = [
      {
        title: '应用系统编码',
        dataIndex: 'appCode',
      },
      {
        title: '应用系统名称',
        dataIndex: 'appName',
      },
      // {
      //   title: '是否启用',
      //   dataIndex: 'op',
      // }
      {
        title: '操作',
        dataIndex:"operation",
        render: (text, record,index) => {
            return (
              <span>
                <Popconfirm 
                 title="确认删除吗？" 
                 onConfirm={() => this.del(index)}
                 >
                   <a>删除</a>
                </Popconfirm>
              </span>
            )
          }
      }
    ];
    
    const paginationProps = {
      defaultPageSize:10,
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
      showSizeChanger:false
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={listData}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default VarietyMaterialTable;
