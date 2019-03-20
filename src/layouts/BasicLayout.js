/**
 * 
 * @description 该版本为左右结构的页面布局,侧边栏改造。   
 * @author  hcf 2019/1/28
 * @warning  
 * 
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message,Modal } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/workspaceMenu';
import logo from './images/icon.png'; 
import myutil from '../utils/myutil';
import request from '../utils/request';
const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;
const confirm = Modal.confirm;
 
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
  };

  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    //解决IE浏览器304缓存问题，导致登录接口没有实际请求后台导致登录不了问题
    const ts = new Date().getTime();
    request("/admin/shopSeller/currentUser?timestamp="+ts).then((d) => {
        if(typeof d=='string') d = JSON.parse(d);
        if(d && d.isSuccess) {
            this.props.dispatch({
              type: 'user/saveCurrentUser',
              payload: d.data,
            });
            //请求未读消息数量
            console.log(this.props)
            let a=myutil.auth.getUserData();
            // console.log(a)
            this.fetchCountFn()
        }else{
              this.props.dispatch(routerRedux.push('/user/login'));
        }
    });
  }

  componentWillUnmount() {
    // unenquireScreen(this.enquireHandler);
  }
  //查询消息未读数量
  fetchCountFn=(data)=>{
    let a={
      member:""
    }
     a=myutil.auth.getUserData();
    if(a.member==null || a.member==undefined || a.member==""){
      this.props.dispatch(routerRedux.push('/user/login'));
    }else{
      const uid={userId:a.member.userId}
      this.props.dispatch({
        type: 'global/fetchCount',
        payload: uid,
      });
    }
  }
  showConfirm=()=> {
    let self=this
    confirm({
      title: '提示',
      content: '是否退出登陆？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = self.props;
        myutil.auth.removeToken();
        dispatch(routerRedux.push('/user/login'));
      },
      onCancel() {
      },
    });
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '一站商城管理后台';
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - 一站商城管理后台`;
    }
    return title;
  }

  getBaseRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleNoticeClear = type => {
    message.warn("该功能暂不可用！")
    // message.success(`清空了${type}`);
    const { dispatch } = this.props;
    // console.log(type)
    // dispatch({
    //   type: 'global/clearNotices',
    //   payload: type,
    // });
  };

  handleMenuClick = ({ key }) => {
    this.showConfirm()
    // if (key === 'triggerError') {
    //   dispatch(routerRedux.push('/exception/trigger'));
    //   return;
    // }
    // if (key === 'logout') {
    //   dispatch({
    //     type: 'login/logout',
    //   });
    // }
  };
  //打开消息列表
  handleNoticeVisibleChange = visible => {
    const { dispatch } = this.props;
    this.setState({
      isPopupVisible:visible
    })
    let a=myutil.auth.getUserData();
    const params={
      current:"1",
      size:"100",
      userId:a.member.userId
    }
    // console.log(this.props)
    if (visible) {
      dispatch({
        type: 'global/fetchNotices',
        payload: params,
      });
    }
    //刷新未读消息的数量
    this.fetchCountFn()
  };
  closeNoticeVisible=()=>{
    this.setState({
      isPopupVisible:false
    })
  }
  //消息已读触发请求
  readCommitFn=(id)=>{
    const { dispatch } = this.props;
    const params={
      ids:id
    }
    dispatch({
      type: 'global/fetchReadCommit',
      payload: params,
    });
  }
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
    } = this.props;
    const { isMobile: mb } = this.state;
    const bashRedirect = this.getBaseRedirect();
    // console.log(getMenuData())
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={mb}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={false}
              // fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={mb}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              isPopupVisible={this.state.isPopupVisible}
              closeNoticeVisible={this.closeNoticeVisible}
              unreadCount={this.props.data.unreadCount}
              readCommitFn={this.readCommitFn}
              fetchCountFn={this.fetchCountFn}
            />
          </Header>
          <Content style={{ margin: '0px 24px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global = {}, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  data:global
}))(BasicLayout);
