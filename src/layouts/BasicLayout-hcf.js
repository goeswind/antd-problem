/**
 * 
 * @description 该版本为左右结构的页面布局。   
 * @author  hcf 2018/7/13
 * @warning  
 * 
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message,Menu } from 'antd';
import DocumentTitle from 'react-document-title';//引入该库，根据不同的路由改变文档的title
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import WorkspaceHeader from '../components/GlobalHeader/WorkspaceHeader';//军哥版本
import GlobalFooter from '../components/GlobalFooter';
import UserPage from '../components/UserHeader';//引入用户界面组建
import WorkspaceSiderMenu from '../components/SiderMenu/WorkspaceSiderMenu';
// import Tabsheads from '../components/Tabsheads/Tabsheads';//引入头部tabs组件
// import WorkspaceSiderMenus from '../components/SiderMenu/WorkspaceSiderMenus';
import NotFound from '../routes/Exception/404';
import { getRoutes,uniq } from '../utils/utils';
import myutil from '../utils/myutil';
import request from '../utils/request';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/workspaceMenu';
import logo from '../assets/logo.svg';
import siderAdd from './images/siderAdd.png'; 
import siderBtn from './images/siderBtn.png'; 
import siderMenuHeadimg from './images/icon.png'; 
import styles from './BasicLayout-hcf.less'; 
import QueueAnim from 'rc-queue-anim';//引入ant-motion动画库 （cnpm install rc-queue-anim --save）
const { Sider } = Layout;
const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;

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
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
	redirectData: [],
    sidemenus: [],
	_sideMenus: [],
    headMainName:"一站商城商户后台",
    userHeadName:"一站商城",
    userImg:siderMenuHeadimg,//用户名称
    isShowUserPage:false,//用户界面开关
    isShowSider:true,//是否展开侧边栏
    isShowSecMenu:false,//二级菜单显示开关
    secMenuItenData:[],//二级菜单数据
    secMenuItenName:"",//二级菜单名称
    currentSecMenuItem:"",//当前二级菜单名
    tabsheadsData:[],
    uniqArr:[],
    currentKey:""
  };
  getMenus() {
	//根据菜单取得重定向地址.
	let redirectData = [];
	const getRedirect = (item) => {
	  if (item && item.children) {
		if (item.children[0] && item.children[0].path) {
		  redirectData.push({
			from: `${item.path}`,
			to: `${item.children[0].path}`,
		  });
		  item.children.forEach((children) => {
			getRedirect(children);
		  });
		}
	  }
	};
	getMenuData().forEach(getRedirect);
	this.setState({'redirectData': redirectData});
  }
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }

  componentWillMount() {
	let menus = getMenuData();
	// console.log('basiclayout willmount 11', menus);
  this.setState({'_sideMenus':menus});
  // console.log('myutil.auth.getToken()')
  // console.log(myutil.auth.getToken())
    //如果Token失效或者不存在，跳到登录界面
    // console.log(123123123)
    // console.log(myutil.auth.getToken())
    if(myutil.auth.getToken()==null){
      // console.log('我进来了')
      // console.log(routerRedux)
      this.props.dispatch(routerRedux.push('/user/login'));
    }
  }

  componentDidMount() {
	const { routerData, location } = this.props;
	const { pathname } = location;
	enquireScreen((mobile) => {
	  this.setState({
		isMobile: mobile,
	  });
	});
	//解决IE浏览器304缓存问题，导致登录接口没有实际请求后台导致登录不了问题
	const ts = new Date().getTime();
	request("/admin/shopSeller/currentUser?timestamp="+ts).then((d) => {
	  // console.log('basiclayout getCurrentUser', d);
	  if(typeof d=='string')
		  d = JSON.parse(d);
	  if(d && d.isSuccess) {
		//message.error("获取用户信息失败");
		// console.log('fetchCurrent success', d);
		this.props.dispatch({
			type: 'user/saveCurrentUser',
			payload: d.data,
		});
	  } else {
		this.props.dispatch(routerRedux.push('/user/login'));
	  }
	}, function(value) {
	 // failure
	});
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    // let lastTabsheadsData =this.state.tabsheadsData
    // console.log("location")
    // this.setState({
    //   tabsheadsData:[...lastTabsheadsData,location.pathname]
    // })
    // console.log(this.props)
    // console.log(routerData)
    // console.log(location)
    const { pathname } = location;
    let title = '商户后台';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name}`;
      // title = `${routerData[pathname].name} - Ant Design Pro`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return '/';
    }
    return redirect;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  getMenus = () => {
      let menus2 = [];
      if(!this.props.sideMenus)
        return menus2;
      this.props.sideMenus.map((item) => {
        if(pathname.indexOf(item.path)>0) {
          menus2.push(item);
        }
      });
        return menus2;
  }
  handleTopMenuClick = (menus) => {
	  this.setState({'sidemenus': menus});
  }
  //控制用户弹出界面
  showUserPage (){
    this.setState({
      isShowUserPage:!this.state.isShowUserPage
    })
  }
  //退出登录,监听子组件的操作动作
  exitConfirm= ()=> {
    const { dispatch } = this.props;
    // console.log('exitConfirm 11', this.props)
	myutil.auth.removeToken();
    // console.log('exitConfirm 22', myutil.auth.getToken());
    dispatch(routerRedux.push('/user/login'));
  }
    //返回工作台
  backToWorkPage(){
	  // console.log('backto workpage');
      //this.props.dispatch(routerRedux.push('/home'));
  }
  //控制侧边栏二级菜单是否展开
  showSecMenuFn (item) {
    // console.log('item')
    // console.log(item)
    if(this.state.currentSecMenuItem==item.name){
      // console.log(111)
      this.setState({
        isShowSecMenu:!this.state.isShowSecMenu, 
        secMenuItenData:item.children,
        secMenuItenName:item.name
      })
    }else{
      this.setState({
        isShowSecMenu:true,
        currentSecMenuItem:item.name,
        secMenuItenData:item.children,
        secMenuItenName:item.name
      })
    }
    // console.log(item)
      
  }
  //控制侧边栏的收缩
  showSiderFn (){
    // console.log("this.state.isShowSider")
    // console.log(this.state.isShowSider)
    this.setState({
      isShowSider:!this.state.isShowSider
    })
  }
  //绘画收起的侧边栏
  renderHideSider(){
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location, sideMenus
    } = this.props;
    const  renderFristPic =sideMenus?sideMenus.map((item)=>{
      return(
        <div className={styles.menuitemHide}>
            <img   
              className={styles.menuLeftLogo} 
              src={item.iconPath}
            /> 
        </div>
          )}
      ):"";
    return(
        <Sider
          trigger={null}
          collapsible={true}
          collapsedWidth={1}
          defaultCollapsed={true}
          collapsed={collapsed}
          breakpoint="lg"
          width={42}
          // theme="light"
          className={styles.siderMain}
        >
          <div className={styles.siderWarp}>
            <div className={styles.HeadMain}>
                <img className={styles.Headimg} src={siderMenuHeadimg}/> 
                {/* <span>{this.state.headMainName}</span> */}
            </div>
            <div className={styles.triggerHide} onClick={()=>this.showSiderFn()}>
                <img className={styles.triggerimg} src={siderBtn} /> 
            </div>
            <div className={styles.menuMainHide}>
                {renderFristPic}
            </div>
          </div>
        </Sider>
      )
  }
  // 
  onSelect=(item)=>{
    let currentName=""
    let currentKey=""
    let menus = getMenuData();
    for(let i=0;i<menus.length;i++){
      for(let j=0;j<menus[i].children.length;j++){
        if(menus[i].children[j].path==item.key){
          currentName=menus[i].children[j].name
          currentKey=menus[i].children[j].path
        }
      }
    }
    let lastUniqArr=this.state.uniqArr
    if(lastUniqArr.indexOf(currentName)>=0){
      this.setState({currentKey:currentKey})
      return
    }
    let lastTabsheadsData=this.state.tabsheadsData
    this.setState({
      uniqArr:[...lastUniqArr,currentName],
      tabsheadsData:[
        ...lastTabsheadsData,
        {title:currentName,key:item.key}
      ],
      currentKey:currentKey
    })
  }
  toPage=(activeKey)=>{
    this.setState({currentKey:activeKey})
    this.props.dispatch(routerRedux.push(activeKey));
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location, sideMenus
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    let sidemenus = this.state.sidemenus;
    if(!sidemenus)
      sidemenus = [];
    if(sidemenus.length<1)
      sidemenus = sideMenus;
	let _sideMenus = this.state._sideMenus;
	if(!_sideMenus || _sideMenus.length<1)
		return (<div></div>);
    // console.log('basiclayout 22', _sideMenus);
    //侧边栏首级导航遍历
    const  renderFristMenu = _sideMenus.map((item)=>{
      return(
        //在打开二级菜单的前提下才能判断点击了哪个二级菜单
          <div  className={this.state.isShowSecMenu?(this.state.secMenuItenName==item.name?styles.menuActive:styles.menuitem):styles.menuitem}  
          onClick={()=>this.showSecMenuFn(item)}
              >
            <img   
              className={styles.menuLeftLogo}
              
              src={this.state.isShowSecMenu?(this.state.secMenuItenName==item.name?item.iconPathShow:item.iconPath):item.iconPath}
            /> 
            <span className={styles.menufront} >{item.name}</span>
            <img className={styles.menuLeftAdd }  src={siderAdd} /> 
          </div>
      )}
    );
	// console.log('basiclayout 55', renderFristMenu);
    const layout = (  
        <Layout>
          <Content style={{ margin: '0 0 0', height: '100%', width: '100%' }}>
            <Layout>
              {/* 通过判断this.state.isShowSider来确实是否收起侧边栏 */}
                {this.state.isShowSider?
                    <Sider
                      trigger={null}
                      collapsible={true}
                      collapsedWidth={1}
                      defaultCollapsed={true}
                      collapsed={collapsed}
                      breakpoint="lg"
                      width={188}
                      // theme="light"
                      className={styles.siderMain}
                    >
                    {/* <div className={styles.siderFixed}> */}
                     <div className={styles.HeadMain}>
                        <img 
                            className={styles.Headimg} 
                            src={siderMenuHeadimg}
                            onClick={()=>this.showUserPage()}
                        /> 
                        <span>{this.state.headMainName}</span>
                     </div>
                     {this.state.isShowUserPage?(
                        <UserPage
                            userImg={this.state.userImg}
                            userName={this.state.userHeadName}
                            exitFn={()=>this.exitConfirm()}
                            backToWorkPage={()=>this.backToWorkPage()}
                        >
                        </UserPage>
                      ):""}
                     
                     <div className={styles.trigger} onClick={()=>this.showSiderFn()}>
                        <img className={styles.triggerimg} src={siderBtn} /> 
                     </div>
                     <div className={styles.menuMain}>
                        <div>{renderFristMenu}</div>
                        <div>
                      {/*QueueAnim将二级菜单的所有内容包住，通过判断this.state.isShowSecMenu确认是否要展开二级菜单。QueueAnim起到二级菜单探入弹出的动画效果  */}
                            <QueueAnim 
                              key="demo"
                              // component={Menu}
                              type={['bottom', 'top']}
                              duration={800}
                              ease={['easeOutQuart', 'easeInOutQuart']}>
                                  {this.state.isShowSecMenu?[
                                  <div className={styles.secMenuMain} key="b">
                                    <WorkspaceSiderMenu
                                        logo={logo}
                                        // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
                                        Authorized={Authorized}
                                        menuData={this.state.secMenuItenData}
                                        collapsed={collapsed}
                                        location={location}
                                        isMobile={this.state.isMobile}
                                        onCollapse={this.handleMenuCollapse}
                                        onSelect={this.onSelect}
                                      />
                                  </div>]:""}
                                </QueueAnim>
                        </div>
                      </div>
                      {/* </div> */}
                    </Sider> 
                  :this.renderHideSider()}
              <Layout>
                  {/* <Tabsheads
                    tabsheadsData={this.state.tabsheadsData}
                    toPage={this.toPage}
                    currentKey={this.state.currentKey}
                  >
                  </Tabsheads>                    */}
                  <Switch>
                    {
                      getRoutes(match.path, routerData).map(item =>
                        (
                        <AuthorizedRoute
                          key={item.key} 
                          path={item.path}
                          component={item.component}
                          exact={item.exact}
                          authority={item.authority}
                          redirectPath="/exception/403"
                        />
                        )
                      )
                    }
                    <Redirect exact from="/" to={bashRedirect} />
                    <Redirect exact from="/exception/500" to={bashRedirect} />
                    <Route render={NotFound} />
                  </Switch>
              </Layout>
             
            </Layout>
          </Content>
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

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  currmenu: global.menu,
  // sideMenus: global.sideMenus,
  sideMenus: global.menus,
}))(BasicLayout);
