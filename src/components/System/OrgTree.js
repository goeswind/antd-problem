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

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  del(record) {
	//删除点击的行
	request("/api/variety/delMaterial", {
		method: 'POST',
		body: {
			ids: record.id
		}
	}).then((json) => {
		//console.log(json);
		//删除后刷新列表数据
		let newData = this.props.data.list;
		newData = newData.filter(item => record.id !== item.id);
		//删除（刷新下）数据，下面两个都不能少，否则删除不了，好奇怪
		this.props.data.list = newData;
		this.setState({data: newData});
	}, function(value) {
	 // failure
	});
  }

  update(record) {
	//TODO 暂时无法实现跳转uri带参数方式实现跳转，并接收请求参数这种推荐的方式，先用store缓存实现，后面有空再改进
	//缓存当前记录主键id，方便跳转到的表单页获取该id值，20秒过期
	myutil.store.set('busiId', record.id, 20);
	const { dispatch } = this.props;
	//跳转表单页，进行编辑数据
	const uri = '/material/variety/step-form?varietyid='+record.id;
	//const uri = '/material/variety/step-form/'+record.id;
	console.log('update to uri: '+uri);
	this.props.dispatch(routerRedux.push(uri));
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: '品种名称',
        dataIndex: 'varietyName',
      },
      {
        title: '剂型',
        dataIndex: 'drugName',
      },
      {
        title: '规格',
        dataIndex: 'specName',
      },
      {
        title: '关联企业',
        dataIndex: 'relativeCorpName',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
		dataIndex: 'operation',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.update(record)}>关联企业</a>
            <Divider type="vertical" />
            <a onClick={() => this.update(record)}>交换资料</a>
            <Divider type="vertical" />
            <a onClick={() => this.update(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.del(record)}>
                <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
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
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default VarietyMaterialTable;
