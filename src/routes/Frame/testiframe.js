/**
 * 
 * @description 项目说明 运力部门，总体情况分析，线路运营情况   
 * @author  hjj  hcf
 * @warning  
 * 
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs, Card, Input, message } from 'antd';
import { routerRedux } from 'dva/router';

import FullheightIframe from '../../components/utils/FullheightIframe';

import styles from './list.less';

export default class TableList extends React.Component {
  state = {
	curtab: '',
  };

  shouldComponentUpdate() {
    return false;
  }

  componentWillMount() {

  }
  // 首次进入加载列表
  componentDidMount() {
    
  }

  render() {
    // const { analysis: { data }, loading } = this.props;
    const {loading } = this.props;
    //console.log(this.props)
    return (
		<div>
			<FullheightIframe gourl='http://nec.netease.com/'>
			</FullheightIframe>
		</div>
    );
  }
}
