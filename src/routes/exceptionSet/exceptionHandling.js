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
import { Tabs,message } from 'antd';
import SettleTable from './exceptionHandlingTable'; //引入结算列表Table
import styles from './index.less';

const TabPane = Tabs.TabPane;

@connect(({ exception, loading }) => ({
  data: exception,
  loading: loading.models.exception,
}))
export default class exceptionHandling extends PureComponent {
  constructor(props) {
    super(props)   
  }
  componentDidMount() {
    this.queryList({
      "current": 1,
      "size": 10,
       state :""    
    });          
    this.getBigException({"parentid":"0"});  // 获取异常的大类
    this.getAllBigException({"parentid":"-1"});  // 获取所以小类异常
  }
  
  queryList(params) {            
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

  getBigException = (params)=> {        
    const { dispatch } = this.props; 
    dispatch({
      type: 'exception/getSelectException',
      payload: params,      
    });
  }
  getAllBigException = (params)=> {        
    const { dispatch } = this.props; 
    dispatch({
      type: 'exception/getAllBigException',
      payload: params,      
    });
  }

  onChange = (key) => {    
    if(key == 1){
      this.queryList({
        pageNumber: 1,
        pageSize: 10 ,
        state :""              
      });
    }else if(key ==2){
      this.queryList({
        pageNumber: 1,
        pageSize: 10,
        state:3           
      });
    }else if(key ==3){
      this.queryList({
        pageNumber: 1,
        pageSize: 10,
        state:9           
      });
    }

  }
  render() {
    return (
      <div className={styles.settleList}>
        <Tabs type="card" onChange={this.onChange}>
          <TabPane tab="全部" key="1">
            <SettleTable queryList={this.queryList} ></SettleTable>
          </TabPane>
          <TabPane tab="待处理" key="2">
            <SettleTable queryList={this.queryList} ></SettleTable>
          </TabPane>
          <TabPane tab="已处理" key="3">
            <SettleTable queryList={this.queryList}></SettleTable>
          </TabPane>
        </Tabs> 
      </div>
    );
  }
}