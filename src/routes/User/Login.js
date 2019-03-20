import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Checkbox, Alert, Icon, Divider, Row, Col, message } from 'antd';
import Login from '../../components/Login';
import request from '../../utils/request';
import myutil from '../../utils/myutil';
import styles from './Login.less';
import loginlogo from './images/loginlogo.png';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
		let options = {
			method:'POST',
			//headers:{'Content-Type': 'application/x-www-form-urlencoded'},
			body:{...values},
		};
    let url = "/admin/shopSeller/login";
		request(url, options).then((json) => {
		  console.log('handleSubmit 11', json); 
		  if(!json) {
		    return;
		  }
		  let data = json.data;
		  if(!json.isSuccess && json.msg) {
			  message.error(json.msg);
			  return;
		  }
		  console.log('handleSubmit 22', data); 
		  if (json.code === '200' && json.data && json.data.accessToken) {
			myutil.auth.setToken(json.data.accessToken);
			myutil.auth.setUserData(json.data);
			//reloadAuthorized();
      console.log('handleSubmit 33', json); 
      this.props.dispatch({
        type: 'global/loginData',
        payload: json.data,
      });
			this.props.dispatch(routerRedux.push('/'));
		  }
		}, function(value) {
			console.log('handleSubmit 44', value); 
			// failure
			this.setState({loading: false});
		});
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  toRegister = () => {
    this.props.dispatch(routerRedux.push('/user/register'));
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
      	<div className={styles.title}>
      		<img src={loginlogo} />
      		<div>一站商城管理后台</div>
      	</div>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <div>
            {
              login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误')
            }
            <UserName name="username" placeholder="请录入用户名" />
            <Password name="password" placeholder="请录入密码" />
          </div>
          <Submit className={styles.loginBtn} loading={submitting}>登录</Submit>

          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={8} md={10} sm={24}>
				<Checkbox className={styles.extra} checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
          </Col>
          <Col span={8} md={6} sm={24}>
			  {/*
				<a className={styles.extra} style={{}} onClick={this.toRegister}>注册</a>
			  */}
          </Col>
          <Col span={8} md={8} sm={24}>
			  {/*
				<a className={styles.extra} style={{}} href="">忘记密码</a>
			  */}
          </Col>
          </Row>
        </Login>
      </div>
    );
  }
}
