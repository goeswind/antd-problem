import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip,Form,Modal } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
// @Form.create()
export default class GlobalHeader extends PureComponent {
  state={
    isModal:false,//消息弹窗默认状态
    modalContent:""
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    // console.log(this.props)
    const notices = this.props.notices?(this.props.notices.data?this.props.notices.data.records:[]):[];
    // const notices1=aa
    if (notices.length === 0) {
      return {};
    }
    const newNotices=notices.map((notice) =>{
      // 所需的data数据字段名称
      // avatar	头像图片链接	string	-
      // title	标题	ReactNode	-
      // description	描述信息	ReactNode	-
      // datetime	时间戳	ReactNode	-
      // extra	额外信息，在列表项右上角	ReactNode	-


      // information
      // title
      // createTime
      const newNotice={...notice}
      if(newNotice.information){
        newNotice.description=newNotice.information
      }
      if(newNotice.createTime){
        newNotice.datetime=newNotice.createTime
      }   
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      newNotice.avatar= "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
      newNotice.type= newNotice.state==0?"未读":"已读"
        return newNotice;
    })
    // ---------------------------------------------------
    // const newNotices1 = notices1.map((notice) => {
    //   const newNotice = { ...notice };
    //   if (newNotice.datetime) {
    //     newNotice.datetime = moment(notice.datetime).fromNow();
    //   }
    //   // transform id to item key
    //   if (newNotice.id) {
    //     newNotice.key = newNotice.id;
    //   }
    //   if (newNotice.extra && newNotice.status) {
    //     const color = ({
    //       todo: '',
    //       processing: 'blue',
    //       urgent: 'red',
    //       doing: 'gold',
    //     })[newNotice.status];
    //     newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
    //   }
    //   return newNotice;
    // });
    // console.log(newNotices)
    // console.log(newNotices1)
    return groupBy(newNotices, 'type');
  }
    getNoticeData2() {
    // console.log(this.props)
    const notices = this.props.notices?(this.props.notices.data?this.props.notices.data.records:[]):[];
    // const notices1=aa
    if (notices.length === 0) {
      return {};
    }
    const newNotices=notices.map((notice) =>{
      // 所需的data数据字段名称
      // avatar 头像图片链接  string  -
      // title  标题  ReactNode -
      // description  描述信息  ReactNode -
      // datetime 时间戳 ReactNode -
      // extra  额外信息，在列表项右上角  ReactNode -


      // information
      // title
      // createTime
      const newNotice={...notice}
      if(newNotice.information){
        newNotice.description=newNotice.information
      }
      if(newNotice.createTime){
        newNotice.datetime=newNotice.createTime
      }   
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      newNotice.avatar= "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"
      newNotice.type= newNotice.state==0?"未读":"已读"
      newNotice.showType= "全部"
        return newNotice;
    })
    return groupBy(newNotices, 'showType');
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
  //选中的消息内容
  onItemClickFn=(item, tabProps) => {
    // console.log(item); // eslint-disable-line
    // console.log(tabProps); // eslint-disable-line
    this.setState({
      isModal:true,
      modalContent:item,
    })
    this.props.readCommitFn(item.id)
    this.props.closeNoticeVisible()
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile, logo,
      onNoticeVisibleChange, onMenuClick, onNoticeClear,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Item key="triggerError"><Icon type="close-circle" />触发报错</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const noticeData2 = this.getNoticeData2();
    const allNoticeData=()=>{
        if(Object.keys(noticeData).length==0){return}
        let a=noticeData['未读'].concat(noticeData['已读'])
        // let b=a.map(data => {
          //添加全部信息下的未读和已读标签
          // if (data.type) {
          //   const color = {
          //     '已读': 'blue',
          //     '未读': 'red',
          //   }[data.type];
          //   data.extra = (
          //     <Tag color={color} style={{ marginRight: 0 }}>
          //       {data.type}
          //     </Tag>
          //   );
          // }
        // })
        return a
      }
    // const { resetFields } = this.props.form;
    const clearRule = () =>{
      // console.log('触发了清空')
      // //重置控件状态
      // resetFields()
    }
    const closeModalVisible = () =>{
      this.setState({
          isModal:false,
      })
      this.props.fetchCountFn()
    }
    return (
      <div className={styles.header}>
        {isMobile && (
          [
            (
              <Link to="/" className={styles.logo} key="logo">
                <img src={logo} alt="logo" width="32" />
              </Link>
            ),
            <Divider type="vertical" key="line" />,
          ]
        )}
        {/* <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        /> */}
        <div className={styles.right}>
          {/* <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder="站内搜索"
            dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
            onSearch={(value) => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={(value) => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
          <Tooltip title="使用文档">
            <a
              target="_blank"
              href="http://pro.ant.design/docs/getting-started"
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a >
          </Tooltip> */}
          <NoticeIcon
            className={styles.action}
            count={this.props.unreadCount?this.props.unreadCount.data.countUnRead:""}
            onItemClick={this.onItemClickFn}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
            popupVisible={this.props.isPopupVisible}
          >
            <NoticeIcon.Tab
              // list={noticeData['未读']}
              list={noticeData2['全部']}
              title="全部"
              emptyText="你已查看所有全部"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['未读']}
              title="未读"
              emptyText="您已读完所有未读"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['已读']}
              title="已读"
              emptyText="你已完成所有已读"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          <Tooltip title="">
            <a
              // target="_blank"
              // href="http://pro.ant.design/docs/getting-started"
              rel="noopener noreferrer"
              className={styles.action}
              key="logout"
              onClick={onMenuClick}
            >
              <Icon  type="logout"  />
            </a >
          </Tooltip>
          {/* {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />} */}
              <Modal
                afterClose={clearRule} 
                style={{ top: 200 }}
                title={'消息详情'}
                okText="确认"
                visible={this.state.isModal}
                width={600}
                onOk={() => closeModalVisible()}
                onCancel={() => closeModalVisible()}
                >
                  <div>
                    <Tag color="#2db7f5">公告</Tag><span className={styles.titleFont}>{this.state.modalContent.title}</span>
                    <div className={styles.timeFont}>{this.state.modalContent.datetime}</div>
                    <div className={styles.contentFont}>{this.state.modalContent.description}</div>
                  </div>
            </Modal>
        </div>
      </div>
    );
  }
}
