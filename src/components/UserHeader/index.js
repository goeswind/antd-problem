/**
 * 
 * @description 该内容为用户信息组件    
 * @author  hcf 2018/7/17
 * @warning  
 * 
 */
import React, { PureComponent } from 'react';
import { Input ,Icon, Form,Popconfirm, message } from 'antd';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';
const { TextArea } = Input;
const FormItem = Form.Item;
@Form.create()
export default class GlobalHeader extends PureComponent {
  // const userImg=this.props
  state = {
    isShowDetails:true,//展开隐藏
  }
  //控制用户弹出界面
  showDetails (sendType){
    const { dispatch, form } = this.props;
    if(sendType==1){
      console.log(1)
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        console.log(fieldsValue)
      });
    }
    this.setState({
      isShowDetails:!this.state.isShowDetails
    })
  }

  //暂不可用
  toWarn(){
    message.warning('亲亲，该功能暂不可用！');
  }
  render() {
    console.log(this.props)
    const userImg=this.props.userImg
    const userName=this.props.userName
    const { getFieldDecorator } = this.props.form;
    const exitFn=this.props.exitFn
    const backToWorkPage=this.props.backToWorkPage
    const sendType=1
    return (
      <Form layout="inline">
          <div className={styles.userPage_wrap}>
              <div className={styles.arrowLogo}></div>
              <div className={styles.user_wrap}>
                  <img className={styles.userImg} src={userImg} 
                        // onClick={()=>this.showFn()}
                  />
                  <div className={styles.userName_wrap}>
                      <div className={styles.userName}>{userName}</div>
                        {/* <Popconfirm 
                          title="请确认是否退出登录?" 
                          onConfirm={exitFn} 
                          onCancel={this.cancel} 
                          okText="是" 
                          cancelText="不是">
                         <span className={styles.exitSys}>退出登录</span>
                       </Popconfirm> */}
                      
                  </div> 
              </div> 
              {this.state.isShowDetails?(
              <div className={styles.userMsg_wrap}>
                  <div  onClick={()=>this.showDetails()} className={styles.userMsg_item}><Icon style={{fontSize:"25px",color:"#5f7c8a"}} type="info-circle-o" /><div className={styles.userMsg_font}>报错</div></div>
                  <div  onClick={()=>backToWorkPage()} className={styles.userMsg_item}><Icon style={{fontSize:"25px",color:"#5f7c8a"}} type="user" /><div className={styles.userMsg_font}>返回工作台</div></div>
                  <div  onClick={()=>this.toWarn()} className={styles.userMsg_item}><Icon style={{fontSize:"25px",color:"#5f7c8a"}} type="setting" /><div className={styles.userMsg_font}>设置</div></div>
                  <Popconfirm 
                      title="请确认是否退出登录?" 
                      onConfirm={exitFn} 
                      onCancel={this.cancel}  
                      okText="是" 
                      cancelText="否">
                      <div   className={styles.userMsg_item}><Icon style={{fontSize:"25px",color:"#5f7c8a"}} type="ellipsis" />
                          <div  className={styles.userMsg_font}>退出登录</div>
                      </div>
                  </Popconfirm>
                      
                  
              </div>):(
              <div className={styles.userMsg_wrap_details}> 
                  <div className={styles.userMsg_details_title}><Icon style={{fontSize:"20px",color:"#5f7c8a"}} type="info-circle" /><span className={styles.userMsg_details_title_font}>报错</span></div>
                  <div className={styles.userMsg_details_textTitle}>文本输入报错内容</div>
                  <FormItem label="">
                    {getFieldDecorator('bugMsg')(
                      <TextArea maxLength="500" rows={2} cols={80} />
                    )}
                  </FormItem>
                  <div className={styles.userMsg_details_btn}  onClick={()=>this.showDetails(sendType)}>提交</div>
                  <div className={styles.userMsg_details_btncal}  onClick={()=>this.showDetails()}><Icon type="close" /></div>
              </div>)
              }
          </div>
      </Form>
    );
  }
}
