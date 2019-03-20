/**
 * 
 * @description 项目说明 头部tabs组件
 * @author    hcf  2018/12/18
 * @warning   
 * 
 */
import React, { PureComponent } from 'react'; //引入react
import { Tabs} from 'antd';//引入antd控件
import { routerRedux } from 'dva/router'; //引入redux
const TabPane = Tabs.TabPane;

//暴露example类
export default class TabsHeads extends PureComponent {
    //当前模块公共的数据管理的地方->state
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
          { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
          { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
          {
            title: 'Tab 3', content: 'Content of Tab 3', key: '3', closable: false,
          },
        ];
        this.state = {
          activeKey: panes[0].key,
          panes,
        };
      }
    // 首次进入加载列表，即生命周期为组件加载完后执行
    componentDidMount() {

    }
    
    onChange = (activeKey) => {
        // this.setState({ activeKey });
        // console.log(activeKey)
        this.props.toPage(activeKey)
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
        this.setState({ panes, activeKey });
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
            lastIndex = i - 1;
        }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
        activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
    }
    render() {
        const { location,tabsheadsData } = this.props;
        console.log(tabsheadsData)
        console.log(location)
        return (
            <Tabs
              onChange={this.onChange}
              activeKey={this.props.currentKey}
              type="editable-card"
              hideAdd={true}
            //   onEdit={this.onEdit}
            >
              {tabsheadsData.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}></TabPane>)}
            </Tabs>
          );
    }
}