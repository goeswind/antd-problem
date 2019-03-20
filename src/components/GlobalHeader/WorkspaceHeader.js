import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Button, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import headlogo from './images/logo.png';

@connect(({ global }) => ({
  currmenu: global.menu,
  menus: global.menus,
}))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  menuClicked = (e) => {
	let path = e.target.getAttribute('path');
  if(document.getElementsByClassName('active')[0]){
  	document.getElementsByClassName('active')[0].style.backgroundColor="transparent";
  	document.getElementsByClassName('active')[0].classList.remove('active');
	}
	e.target.style.backgroundColor="#1cc4de";
	e.target.classList.add('active');
	let menus2 = [];
	this.props.menus.map((item) => {
		if(item.path===path) {
			menus2 = item.children;
		}
	});

	this.props.dispatch({
	  type: 'global/saveCurrMenu',
	  payload: {
		sideMenus: menus2,
	  },
	});

	this.props.onTopMenuClick(menus2);
  }
  getTopMenus() {
	if(!this.props.menus)
		return (<span></span>);
	this.props.dispatch({
	  type: 'global/saveCurrMenu',
	  payload: {
		sideMenus: this.props.menus[0].children,
	  },
	});
	return (
		<span>
		  {
			this.props.menus.map(item =>
			  <div className={styles.headitem} onClick={this.menuClicked} path={item.path}>{item.name}</div>
			)
		  }
		</span>
	)
  }
  returnHome = () => {
	this.props.dispatch(routerRedux.push('/home'));
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile, logo,
      onNoticeVisibleChange, onMenuClick, onTopMenuClick, onNoticeClear,
    } = this.props;
	if(!currentUser)
		currentUser = {};
	if(!currentUser.notifyCount)
		currentUser.notifyCount = 0;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Item key="triggerError"><Icon type="close-circle" />触发报错</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.header}>
        {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                <img src={logo} alt="logo" width="32" title="回首页" />
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )}
        <img title="回首页"
          className={styles.trigger}
          src={headlogo}
          onClick={this.returnHome}
        />
        <div className={styles.headText} onClick={this.returnHome}>
          回首页
        </div>
	   		{this.getTopMenus()}
        <div className={styles.right}>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
        </div>
      </div>
    );
  }
}
