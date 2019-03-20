import { isUrl } from '../utils/utils';

const menuData = [
{
  name: '大屏',
  icon: 'global',
  path: 'bigscreen',
}, {
  name: '5大数字化报表',
  icon: 'team',
  path: 'org',
  children: [{
    name: '经营分析数字化',
    path: 'busiAnalysis',
    children: [{
      name: '线路经营分析',
      path: 'line',
    }, {
      name: '客户经营分析',
      path: 'customer',
	  children: [{
		  name: '总体客户经营情况',
		  path: 'total',
		}, {
		  name: '客户经营分布地图',
		  path: 'distribute',
		}, {
		  name: '客户类型的经营情况',
		  path: 'type',
		}]	
    }]
  }, {
    name: '运营部门数字化',
    path: 'operate',
    children: [{
      name: '运营指标报表',
      path: 'quota',
	  children: [{
		  name: '固定指标报表',
		  path: 'fixed',
		}, {
		  name: '客户指标报表',
		  path: 'customer',
		}, {
		  name: '供应商指标报表',
		  path: 'supplier',
		}]		 
    }, {
      name: '运营情况分析',
      path: 'condition',
    }, {
      name: '运营数据自定义',
      path: 'diy',
    }]
  }, {
    name: '运力部门数字化',
    path: 'capacitypool',
    children: [{
      name: '运力指标报表',
      path: 'quota',
    }, {
      name: '运力情况分析',
      path: 'condition',
    }, {
      name: '运力数据自定义',
      path: 'diy',
    }]
  }, {
    name: '财务部门数字化',
    path: 'finance',
    children: [{
      name: '财务指标报表',
      path: 'quota',
    }, {
      name: '财务固定报表',
      path: 'quota',
    }, {
      name: '财务情况分析',
      path: 'condition',
    }, {
      name: '财务数据自定义',
      path: 'diy',
    }]
  }, {
    name: '市场部门数字化',
    path: 'market',
    children: [{
      name: '市场指标报表',
      path: 'quota',
    }, {
      name: '市场情况分析',
      path: 'condition',
    }, {
      name: '市场数据自定义',
      path: 'diy',
    }]
  }],
},{
  name: '专题数据分析',
  icon: 'database',
  path: 'special',
  children: [{
    name: '运力池数据分析',
    path: 'capacitypool',
    children: [{
      name: '货车数据分析',
      path: 'cardata',
    }, {
      name: '司机数据分析',
      path: 'driverdata',
    }, {
      name: '运力池数据自定义',
      path: 'diy',
    }]
  }, {
    name: '导航球数据分析',
    path: 'navigate',
    children: [{
      name: '流量日志分析',
      path: 'flowlog',
    }, {
      name: '访问日志分析',
      path: 'accesslog',
    }, {
      name: '内部数据分析',
      path: 'internal',
    }, {
      name: '导航球数据自定义',
      path: 'diy',
    }]
  }, {
    name: 'ITMS数据分析',
    path: 'itms',
    children: [{
      name: '线路数据',
      path: 'linedata',
    }, {
      name: '客户数据',
      path: 'customer',
    }, {
      name: '供应商数据',
      path: 'supplier',
    }, {
      name: '流量日志分析',
      path: 'log',
    }, {
      name: '访问量数据分析',
      path: 'pu',
    }, {
      name: 'ITMS数据自定义',
      path: 'diy',
    }]
  }, {
    name: '运维网络数据监控',
    path: 'ops',
    children: [{
      name: '运维日志数据监控',
      path: 'logdata',
    }, {
      name: '运维网络防御监控',
      path: 'network',
    }, {
      name: '硬件维护数据',
      path: 'hardwaredata',
    }, {
      name: '运维数据自定义',
      path: 'diy',
    }]
  }],
}, {
  name: '数据分析软件',
  icon: 'pie-chart',
  path: 'software',
  children: [{
    name: '北京思瑞BI',
    path: 'ruisi',
  }, {
    name: 'Power BI工作台',
    path: 'powerbi',
  }]
},{
  name: '系统管理',
  icon: 'lock',
  path: 'system',
  children: [{
    name: '应用管理',
    path: 'app',
  }, {
    name: '机构管理',
    path: 'org',
  }, {
    name: '用户管理',
    path: 'user',
  }, {
    name: '菜单管理',
    path: 'menu',
  }, {
    name: '角色管理',
    path: 'role',
  }],
}, {
  name: 'iframe',
  icon: 'form',
  path: 'frame',
  children: [{
    name: 'main1',
    path: 'main',
  }],
}, {
  name: 'iframe2',
  icon: 'form',
  path: 'frame/main'
}, {
  name: '指标分析',
  icon: 'form',
  path: 'analysis',
  children: [{
    name: '运作指标分析面板',
    path: 'dashboard',
  }, {
    name: '按运作节点分析',
    path: 'opernode',
    children: [{
      name: '客户维度',
      path: 'customer',
    }, {
      name: '供应商维度',
      path: 'supplier',
    }]
  }, {
    name: '线路货量情况',
    path: 'lineweight',
  }],
}, {
  name: '新版Home',
  icon: 'form',
  path: 'home/main'
}, {
  name: 'Workspace',
  icon: 'form',
  path: 'workspace'
}]; 

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
