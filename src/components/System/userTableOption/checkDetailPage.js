//查看内容表单页
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Radio, Modal, message } from 'antd';

const FormItem = Form.Item;
@Form.create()


class CheckDetailPage extends PureComponent{
    state={

    };

    render() {
        const { getFieldDecorator} = this.props.form;
        const form = this.props.form;
        const { modalVisible, handleAdd, handleModalVisible } = this.props;
        // console.log(form)
        const okHandle = () => {
          form.validateFields((err, fieldsValue) => {
            if (err) return;
            // handleAdd(fieldsValue);
          });
        };
        // console.log('这是props')
        // console.log(this.props)
        const demodata =this.props
        return (
            <Modal
              title="查看用户"
              visible={modalVisible}
              onOk={okHandle}
              onCancel={() => handleModalVisible()}
            >
                <FormItem
                  labelCol={{ span:5 }}
                  wrapperCol={{ span:15}}
                  label="登陆账号"
                >
                  {getFieldDecorator('account', {
                    rules: [{ required: true, message: '请输入登陆账号...' }],
                    initialValue:demodata.account
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span:5 }}
                  wrapperCol={{ span: 15 }}
                  label="登陆密码"
                >
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入登陆密码...' }],
                    
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="再次输入"
                >
                  {getFieldDecorator('againPassword', {
                    rules: [{ required: true, message: '请再次输入...' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="用户姓名"
                >
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户姓名...' }],
                    initialValue:demodata.userName
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="用户类型"
                >
                  {getFieldDecorator('userType', {
                    rules: [{ required: false, message: '请选择用户类型...' }],
                    initialValue:123
                  })(
                    <Select style={{ width: 295 }}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" >Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem><FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="金蝶代码"
                >
                  {getFieldDecorator('jindieCode', {
                    rules: [{ required: false, message: '请输入金蝶代码...' }],
                    initialValue:demodata.jindieCode
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="tom用户名"
                >
                  {getFieldDecorator('tomAccount', {
                    rules: [{ required: false, message: '请输入tom用户名...' }],
                    initialValue:demodata.tomAccount
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="固定电话"
                >
                  {getFieldDecorator('telephone', {
                    rules: [{ required: false, message: '请输入固定电话号码...' }],
                    initialValue:demodata.telephone
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="手机"
                >
                  {getFieldDecorator('phoneNum', {
                    rules: [{ required: false, message: '请输入手机号码...' }],
                    initialValue:demodata.phoneNum
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 15 }}
                  label="备注信息"
                >
                  {getFieldDecorator('note', {
                    rules: [{ required: false, message: '请输入备注信息...' }],
                    initialValue:demodata.note
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
          </Modal>
        )
    }

}
export default CheckDetailPage