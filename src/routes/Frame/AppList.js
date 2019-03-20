import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, message } from 'antd';
import { routerRedux } from 'dva/router';
import FullheightIframe from '../../components/utils/FullheightIframe';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import request from '../../utils/request';

import styles from './list.less';

@connect(({ system, loading}) => ({
  loading: loading.models.system,
  data: system, 
}))
export default class TableList extends PureComponent {
  state = {
	pageinited: false,
  };
  // 首次进入加载列表
  componentDidMount() {
	window.onresize = this.handleResize;
  }

  componentWillUpdate() {
	if(!this.state.pageinited) { //此处不加会导致陷入死循环，网页打开一直卡顿空白
	  this.handleResize(); //此处不加，页面刚进入时，echart无法自适应
	  this.setState({'pageinited': true}); //此处不加会导致陷入死循环，网页打开一直卡顿空白
	}
  }

  handleResize = (e) =>  {
	let width = 900;
	let height = 64;
	if(document.querySelector('.ant-layout')) {
		width = document.querySelector('.ant-layout-header').offsetWidth;
		height = document.querySelector('.ant-layout-header').offsetHeight;
		console.log('AppList handleResize heigth: '+height+', width: '+width);

		const fullWidth = width;

		const { dispatch } = this.props;
		dispatch({
		  type: 'system/save',
		  payload:{headerHeight:height,fullWidth:fullWidth}
		});	
	}
  }

  render() {
    const { dispatch, loading } = this.props;

    return (
      <div>
        <FullheightIframe  />
      </div>
    );
  }
}
