import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'dva/router';
import styles from './index.less';
import { urlToList } from '../utils/pathTools';
import UserHeader from '../UserHeader/index'
const { Sider } = Layout;
const { SubMenu } = Menu;

const getIcon = (icon) => {
  console.log(icon)
  return <Icon type="minus" />;
};
const getIcon2 = (icon) => {
  return <Icon type="plus" />;
};

export const getMeunMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter((item) => {
	let path1 = item;
	if(item.path) 
		path1 = item.path;
    return pathToRegexp(path1).test(path);
  });
};

@connect(({ global }) => ({
  currmenu: global.menu,
  menuOpenKeys: global.menuOpenKeys,
  menus: global.menus,
}))
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
      isshowAdd:true,
      openKeysAll:[]
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
  }
  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
	let _flatMenuKeys = this.flatMenuKeys;
	if(this.props.menuData)
		_flatMenuKeys = this.props.menuData;
    return urlToList(pathname)
      .map((item) => {
        return getMeunMatcheys(_flatMenuKeys, item)[0];
      })
      .filter(item => item);
  }
  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
	if(!menus)
		return keys;
    menus.forEach((item) => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }
  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = item.icon?getIcon(item.icon):'';
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
        	{/* {icon} */}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isMobile
            ? () => {
                this.props.onCollapse(true);
              }
            : undefined
        }
      >
        {/* {icon} */}
        <span>{name}</span>
      </Link>
    );
  };
  //点击的时候改变内容的小图标
  // changeMenuarrow =(item)=>{
  //   console.log(item.path)
  //   let a=this.state.openKeysAll
  //   console.log(a)
  //   for(let i=0;i<a.length;i++){
  //       if(item.path==a[i]){
  //         console.log(11111)
  //          return getIcon(item.icon)
  //       }else{
  //          return  getIcon2(item.icon)
  //         console.log(22222) 
  //       }
  //   }
  // }
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    // console.log("item")
    // console.log(item)
    if (item.children && item.children.some(child => child.name)) {
      return (
        <SubMenu
          // title={
          //   item.icon ? (
          //     <span>
          //       <span>{item.name}</span> 
          //       <span className={styles.menuTitleLogo}>{getIcon(item.icon)}</span>
          //     </span>
          //   ) : (
          //     item.name
          //   )
          // }
          title={item.name
              // <span>
              //   <span>{item.name}</span> 
              //   {/* <span className={styles.menuTitleLogo}>{this.changeMenuarrow(item)}</span> */}
              //   {/* <span className={styles.menuTitleLogo}>{getIcon(item.icon)}</span> */}
              // </span> 
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
      );
    }
  };
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };
  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const { location: { pathname } } = this.props;
	let _flatMenuKeys = this.flatMenuKeys;
	if(this.props.menuData)
		_flatMenuKeys = this.props.menuData;
    let result = urlToList(pathname).map(itemPath =>
      getMeunMatcheys(_flatMenuKeys, itemPath).pop(),
    );
	for(let i=0;i<result.length;i++) {
		let o = result[i];
		//如果选中的菜单path不是当前url path，则寻找其子菜单中与当前url path相同的菜单
		//比较难理解，但之前一直无法选中包含有children的左边树节点菜单的子菜单
		if(o && o.path && o.path.length<pathname.length) {
			result = urlToList(pathname).map(itemPath =>
				  getMeunMatcheys(o.children, itemPath).pop(),
				);
			break;
		}
	}
	let result2 = [];
	for(let i=0;i<result.length;i++) {
		let res = result[i];
		if(res && res) {
			if(res.path) {
				result2.push(res.path);
			} else {
				result2.push(res);
			}
		} else {
			result2.push(res);
		}
	}

	//let arr = [{0:undefined,1:undefined,2:'/org/operate/quota',3:'/org/operate/quota/fixed'}];
	//return arr;

	return result2;
  };
  // conversion Path
  // 转化路径
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };
  isMainMenu = (key) => {
	if(!this.menus)
		return false;
    return this.menus.some(
      item =>
        key && (item.key === key || item.path === key),
    );
  }
  menuClick=(selectItem)=>{

  }
  //当一个菜单打开始时另外一个收起。
  handleOpenChange = (openKeys) => {
    // console.log("asdasdsa")
    // console.log(openKeys)
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
      isshowAdd:!this.state.isshowAdd,
      openKeysAll:openKeys
    });
  };
  getMenuProps = () => {
    const { location: { pathname } } = this.props;
    const { logo, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    let menuProps = collapsed
      ? {}
      : {
        openKeys,
      };
	if(menuProps && menuProps.lenght==1 && menuProps[0].path) {
		menuProps.push(menuProps[0].path);
	}
	return menuProps;
  };

  render() {
    const { logo, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = this.getMenuProps();
    // if pathname can't match, use the nearest parent's key
    // let selectedKeys = this.getSelectedMenuKeys();
    // console.log("selectedKeys")
    // console.log(selectedKeys)
    // if (!selectedKeys.length) {
    //   selectedKeys = [openKeys[openKeys.length - 1]];
    // }
    return (
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          // defaultOpenKeys={this.props.menuOpenKeys}
          style={{ padding: '0 0', width: '100%',color:"#999999"}}
          onOpenChange={this.handleOpenChange} //onOpenChange是SubMenu展开/关闭的回调
          onSelect={this.props.onSelect}
        >
          {this.getNavMenuItems(this.props.menuData)}
        </Menu>
    );
  }
}
