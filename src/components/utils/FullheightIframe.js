import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'dva';

@connect(({ system, loading}) => ({
  loading: loading.models.system,
  data: system, 
}))
export default class FullheightIframe extends Component {

    constructor() {
        super();
        this.state = {
            iFrameHeight: '0px'
        }
    }

    render() {
		const { data } = this.props;
		console.log('fulliframe 88888888888', this.props);
        return (
            <iframe 
                style={{ width:'100%', height:this.state.iFrameHeight, overflow:'visible'}}
                onLoad={() => {
                    const obj = ReactDOM.findDOMNode(this);
					/*
					//����ô˾���������Ӧ�߶ȣ����Ǳ��������
                    this.setState({
                        "iFrameHeight":  (obj.contentWindow.document.body.scrollHeight+64) + 'px'
                    });
					*/
					//���������ȡ����Ӧ�߶Ⱦ�û������
					const height = window.parent.document.body.scrollHeight-5;
					console.log('iframe 11', height);
                    this.setState({
                        //"iFrameHeight":  (obj.contentWindow.document.body.scrollHeight+64) + 'px'
						"iFrameHeight":  height+'px'
                    });
                }} 
                ref="iframe" 
                src={this.props.gourl} 
                width="100%" 
                height={this.state.iFrameHeight}  
                frameBorder="0"
            />
        );
    }
}