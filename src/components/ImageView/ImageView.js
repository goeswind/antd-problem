import React, { PureComponent,Fragment } from 'react';
import  {Form, Icon, Modal } from 'antd';
/**
 * 图片预览
 */
import style from './ImageView.less';
import $ from 'jquery';
import viewImage from './view'
@Form.create()
export default class ImageView extends PureComponent {
  constructor(props){
    super(props);
    this.state={
      imgShow:"none",
        
    };
  }
  //页面渲染完成后
  componentDidMount(){
    this.props.onRef(this);
    this.setState({
      ...this.props
    })
  }
  showModal=()=>{
    this.setState({
      imgShow:"block",
    },()=>{
      const{imgSrc,imgShow,imgWidth,imgHeight} = this.props;
      viewImage.initView(imgSrc,{width:imgWidth,height:imgHeight});
    })
  }
  handleCancel=()=>{
    this.setState({
      imgShow:"none",
    });
    //图片路径清空 处理
    $("#maskLayerImgbox").html("");//
  }
    render(){
      return(
            <div className={style.maskLayer} style={{display:this.state.imgShow}}>
              <div className={style.maskLayerBlack}></div>
              <div className={style.maskLayerContainer}>
                <div style={{position:'absolute',width:'100%',top:4,textAlign:'right',zIndex:99999}}>
                        <div style={{
                        display:'inline-block',height:30,boxSizing:'border-box',
                        paddingBottom:5,paddingTop:5,paddingLeft:14,paddingRight:14,borderRadius:6,
                                }}>
                             <Icon type="close" onClick={this.handleCancel} className={style.close} style={{fontSize:20,cursor:'pointer'}} />&nbsp;&nbsp;&nbsp;
                        </div>
                </div>
                <div id="maskLayerImgbox" className={style.maskLayerImgbox}>
                </div>
                <div style={{position:'absolute',width:'100%',bottom:4,textAlign:'center',zIndex:99999}}>
                      <div style={{
                      display:'inline-block',height:30,backgroundColor:'#6f6965',boxSizing:'border-box',
                      paddingBottom:5,paddingTop:5,paddingLeft:14,paddingRight:14,borderRadius:6,
                              }}>
                          <Icon id="viwLarge" type="plus-circle-o"  style={{fontSize: 20,cursor:'pointer'}} />&nbsp;&nbsp;&nbsp;
                          <Icon id="viewSmall" type="minus-circle-o" style={{fontSize: 20,cursor:'pointer'}}/>&nbsp;&nbsp;&nbsp;
                          <Icon id="viewLeft" type="reload" style={{transform:'scaleX(-1)',fontSize:20,cursor:'pointer'}}/>&nbsp;&nbsp;&nbsp;
                          <Icon id="viewRight" type="reload"  style={{fontSize:20,cursor:'pointer'}}/> 
                      </div>
                </div>
              </div>
            </div>
      );
    }
    
  }