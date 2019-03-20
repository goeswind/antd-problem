/**
 * 
 * @description 项目说明 example管理--example列表
 * @author    hcf  2017/11/17
 * @warning   
 * 
 */
import React, { PureComponent } from 'react'; //引入react
import { connect } from 'dva'; //引入dva
import { Row, Col, Card, Form, Input, Select, Icon, Button, message } from 'antd';//引入antd控件
import { routerRedux } from 'dva/router'; //引入redux

//导入model层
@connect(({ example, loading}) => ({
    loading: loading.models.example,
    data: example,
}))

//暴露example类
export default class example extends PureComponent {
    //当前模块公共的数据管理的地方->state
    state = {
        
    };
    // 首次进入加载列表，即生命周期为组件加载完后执行
    componentDidMount() {

    }
    render() {
        return(
            <div>123</div>
        )
    }
}