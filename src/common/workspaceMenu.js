import { isUrl } from '../utils/utils';
import {uploadUrl} from '../utils/env';
//import { APP_ENV } from '../../config/environment.config';

const appEnv = process.env.APP_ENV;
console.log('workspace menu');
console.log(appEnv);

 // 添加修改的权限统一归hcf管理，谢谢~~也就是，其他人别瞎鸡儿乱写
let menuData = [
    {
      name: '商品管理', 
      path: 'goodsManagement',
      icon: 'shopping',
      iconPath: '/siderMenu/goods-1.png',
      iconPathShow: '/siderMenu/goods-2.png',
      children: [
        {
          name: '车型列表',
          path: 'carsList',
        },
      ]
    },
]; 

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
// console.log("getMenuData")
// console.log(getMenuData())
