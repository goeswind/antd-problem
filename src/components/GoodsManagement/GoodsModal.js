/**
 * 
 * @description 项目说明  商品管理   商品管理修改页面  弹出框   
 * @author  lvyongjian
 * @warning  
 * 
 */

import React, { PureComponent } from 'react';
import { Row, Col,Checkbox, Card, Form, Input, Select, Icon, Button, Upload, Dropdown,Switch, Menu, InputNumber,Cascader, DatePicker, Radio, Modal, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import $ from 'jquery';
import { goodsEdit, goodsItemEdit } from '../../services/goodsManagement';//引入修改方法JS
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const confirm = Modal.confirm;
@Form.create()

@connect(({goodsManagement,user}) => ({
    selRowData: goodsManagement, 
    currentUserData: user.currentUser
}))

export default class GoodsModal extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
        UploadImgUrl:'/admin/image/upload_to_public_read',//上传图片的url路径   图片上传--公共读
        previewVisible: false,//是否预览图片
        previewImage:'',//预览图片
        pcPicture:[],//上传普通图片数量，PC端只能上传一张图片
        wapPicture:[],//上传普通图片数量，移动端只能上传一张图片
        pcQualityPicture:[],//上传精品图片数量，PC端只能上传一张图片
        wapQualityPicture:[],//上传精品图片数量，移动端只能上传一张图片
        pcPictureUrl:[],//临时保存上传普通图片Url，PC端只能上传一张图片
        wapPictureUrl:[],//临时保存上传普通图片Url，移动端只能上传一张图片
        pcQualityPictureUrl:[],//临时保存上传精品图片Url，PC端只能上传一张图片
        wapQualityPictureUrl:[],//临时保存上传精品图片Url，移动端只能上传一张图片
        checked: false,//是否特惠线路，默认为否
        promotionId:'',//特惠线路值
        isQualityLine:false,//商品标志是否选择“精品线路”
        isQualityFlag:false,//标记商品标志是否初始化(即是否点击过)
        pcFileList: [],////存放修改时初始化PC端图片信息
        wapFileList: [],////存放修改时初始化移动端图片信息
        pcQualityFileList: [],////存放修改时初始化PC端精品图片信息
        wapQualityFileList: [],////存放修改时初始化移动端精品图片信息
        modalTitle:'新增',//modal的标题
    }
  }
    componentDidMount() {
        this.props.onRef(this);
    }

    //查看图片
    handlePreview = (file) => {
        this.setState({
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
        });
    }
    //取消预览图片
    handleCancel = () => this.setState({ previewVisible: false });

    //上传图片
    UploadImg = (info, type) => {
        const form = this.props.form;
        let that = this;
        if (info.file.status == 'uploading') {
            const isLt2M = info.file.size / 1024 / 1024 < 2;
            if(!isLt2M){
                message.error('图片大于2M，请重新上传');
                if(type == 'pcPicture'){//PC端普通商品图片
                    form.setFieldsValue({'pcMainImages':''});//将图片从form表单中删除
                }else if(type == 'wapPicture'){//移动端普通商品图片
                    form.setFieldsValue({'wapMainImages':''});
                }else if(type == 'pcQualityPicture'){//PC端精品商品图片
                    form.setFieldsValue({'pcQualityGoodsImages':''});
                }else if(type == 'wapQualityPicture'){//移动端精品商品图片
                    form.setFieldsValue({'wapQualityGoodsImages':''});
                }
                return false
            }
            //校验是否图片格式
            if(info.file.type.split('/')[0] != 'image'){
                message.error('图片格式不正确，请重新上传');
                return false;
            }
        }
        if(info.file.status == 'removed'){//删除图片
            confirm({
				title: '确定要删除图片?',
				okText:"确认",
				cancelText:"再想想",
				onOk() {
                    //将图片信息从state中移除
                    if(type == 'pcPicture'){//PC端普通商品图片
                        that.setState({pcPicture:[],pcPictureUrl:[],pcFileList:[]});
                        form.setFieldsValue({'pcMainImages':''});//将图片从form表单中删除
                    }else if(type == 'wapPicture'){//移动端普通商品图片
                        that.setState({wapPicture:[],wapPictureUrl:[],wapFileList:[]});
                        form.setFieldsValue({'wapMainImages':''});//将图片从form表单中删除
                    }else if(type == 'pcQualityPicture'){//PC端精品商品图片
                        that.setState({pcQualityPicture:[],pcQualityPictureUrl:[],pcQualityFileList:[]});
                        form.setFieldsValue({'pcQualityGoodsImages':''});//将图片从form表单中删除
                    }else if(type == 'wapQualityPicture'){//移动端精品商品图片
                        that.setState({wapQualityPicture:[],wapQualityPictureUrl:[],wapQualityFileList:[]});
                        form.setFieldsValue({'wapQualityGoodsImages':''});//将图片从form表单中删除
                    }
                },
                onCancel() {},
            });
			return
        }
        if(type == 'pcPicture'){//PC端普通商品图片
            this.setState({pcPicture: info.fileList,pcFileList:info.fileList});
        }else if(type == 'wapPicture'){//移动端普通商品图片
            this.setState({wapPicture: info.fileList, wapFileList:info.fileList});
        }else if(type == 'pcQualityPicture'){//PC端精品商品图片
            this.setState({pcQualityPicture: info.fileList, pcQualityFileList:info.fileList});
        }else if(type == 'wapQualityPicture'){//移动端精品商品图片
            this.setState({wapQualityPicture: info.fileList, wapQualityFileList:info.fileList});
        }
        if(info.file.status == "done"){
            //上传成功后，调用方法进行将文件传输到服务器，
            const resp = info.file.response || null;
            if(resp != null && resp.isSuccess){
                const data = resp.data;
                const url = data.url || null;
                if(typeof(url) == "undefined" || url == null){
                    message.error(data.msg || "图片上传失败，请重新选择图片再次上传");
                    return false;
                }
                //将图片信息保存到state中
                if(type == 'pcPicture'){//PC端普通商品图片
                    this.setState({pcPictureUrl: url});
                }else if(type == 'wapPicture'){//移动端普通商品图片
                    this.setState({wapPictureUrl: url});
                }else if(type == 'pcQualityPicture'){//PC端精品商品图片
                    this.setState({pcQualityPictureUrl: url});
                }else if(type == 'wapQualityPicture'){//移动端精品商品图片
                    this.setState({wapQualityPictureUrl: url});
                }
            }
        }else if (info.file.status === 'error') {//如果出错
            //用jquery自动移除上传图片的显示内容框
            // $(".anticon-delete").click();
            message.error(info.file.error || '图片上传失败，请重新选择图片再次上传');
        }else{//其他状态，等待加载完成后，关闭上传的进度框
        
        }
    }

    //商品标志：选择是否精品线路，是则弹出图片上传功能，否则不显示图片上传功能
    lineChange = (value) => {
        if(value == '01'){//精品线路
            this.setState({isQualityLine:true,isQualityFlag:true});
        }else{//普通商品
            // this.setState({isQualityLine:false,isQualityFlag:true,pcQualityPictureUrl:[],wapQualityPictureUrl:[],pcQualityFileList:[],wapQualityFileList:[]});
            this.setState({isQualityLine:false,isQualityFlag:true,pcQualityPictureUrl:[],wapQualityPictureUrl:[],pcQualityFileList:[],wapQualityFileList:[],pcQualityPicture:[],wapQualityPicture:[]});
        }
    }

    //是否选择特惠线路
    onChangeTH = (e) => {
        this.setState({
            checked: e.target.checked,
        });
        if(!e.target.checked){
            this.setState({promotionId:''});
        }
    }

    /**
     * 判断上传文件是否大于1M，如果超过1M，则给出提示，不能大于1M
     */
    // beforeUpload =(file,fileList)=>{
    //     if(file.size > 1024*1024*1){
    //         message.error("选择的图片大小应小于1M");
    //         setTimeout(function(){
    //             $(".anticon-delete").click();
    //         },200);
    //         return false 
    //     }else{//否则就提示报错信息
    //         return true ;
    //     }
    // }

    //初始化图片，提供给父组件调用
    initPictures(pcFileList,wapFileList){
        this.setState({
            pcPictureUrl:pcFileList.length>0?pcFileList[0].url:'',
            pcPicture:pcFileList,
            pcFileList,
            wapPictureUrl:wapFileList.length>0?wapFileList[0].url:'',
            wapPicture:wapFileList,
            wapFileList,
        });
    }
    //初始化精品图片，提供给父组件调用
    initQualityPictures(pcQualityFileList,wapQualityFileList){
        this.setState({
            pcQualityPictureUrl:pcQualityFileList.length>0?pcQualityFileList[0].url:'',
            pcQualityPicture:pcQualityFileList,
            pcQualityFileList,
            wapQualityPictureUrl:wapQualityFileList.length>0?wapQualityFileList[0].url:'',
            wapQualityPicture:wapQualityFileList,
            wapQualityFileList,
        });
    }

    //初始化是否特惠线路，提供给父组件调用
    initLineChecked(checked){
        this.setState({checked});
    }

    //选择特惠线路
    handleChange = (value)=>{
        this.setState({promotionId:value});
    }

  // 渲染页面
  render() {
        const modalVisible = this.props.selRowData.modalGoods;
        const { that, formValues, page, dispatch } = this.props;
        const { pcFileList,wapFileList,pcQualityFileList,wapQualityFileList,isQualityLine,isQualityFlag,pcPictureUrl,wapPictureUrl,pcQualityPictureUrl,wapQualityPictureUrl,promotionId } = this.state;//获取state中的内容
        const {getFieldDecorator,resetFields} = this.props.form;
        const form = this.props.form;
        let tmp_goods = {};//商品信息
        let lineByCityList = [];//特惠线路列表
        if(that.editType === 'goods'){
            tmp_goods = this.props.selRowData.goodsDetail;//主商品信息
            lineByCityList = this.props.selRowData.lineByCityList;//主商品特惠线路
        }else{
            tmp_goods = this.props.selRowData.goodsItemDetail;//明细商品信息
            lineByCityList =this.props.selRowData.lineByCityAndDistrictList;//明细商品特惠线路
        }
        const lineOptions = lineByCityList.length > 0?lineByCityList.map(d => <Option key={d.id}>{d.activityTitle}</Option>):"";
        const formItemLayout = {
            labelCol: {
              sm: { span:6 },
            },
            wrapperCol: {
              sm: { span: 18 },
            },
          };
        const formItemLayout2 = {
            labelCol: {
              sm: { span:8 },
            },
            wrapperCol: {
              sm: { span: 16 },
            },
          };
        const styleItem={style:{marginBottom:8}};

        //每次关闭弹出层都将state里的数据缓存清空，即重新请求一次查询详情接口服务
        const clearRule = () =>{
            // console.log('触发了清空')
            //重置控件状态
            resetFields()
            tmp_goods = {};
            this.setState({pcFileList:[],wapFileList:[],pcQualityFileList:[],wapQualityFileList:[],checked:false});
            // $(".anticon-delete").click();//删除图片
            // const nulldata={}
            // this.props.dispatch({
            //     type: 'capacity/queryTbBoBidDetailByID',
            //     payload: nulldata
            // });
        } 
        //关闭弹出框
        const handleModalVisible = () =>{
            this.setState({isQualityLine:false,isQualityFlag:false,pcFileList:[],wapFileList:[],pcQualityFileList:[],wapQualityFileList:[],checked:false});
            this.props.dispatch({
              type: 'goodsManagement/modalGoods',
              callback: () =>{
              },
            });
          }
        const okHandle =()=>{
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                //这是编辑请求
                //这是编辑请求参数预处理
                console.log("进来的是编辑")
                if(that.editType === 'goods'){//主商品编辑
                    const newFillData1={
                        goodsId:tmp_goods.id,
                        title:fieldsValue.title,
                        pcMainImages:this.state.pcPictureUrl,
                        wapMainImages:this.state.wapPictureUrl,
                        price:fieldsValue.price,
                        goodsFlag:fieldsValue.goodsFlag,
                        description:fieldsValue.description,
                        promotionId:promotionId?promotionId:0,
                        pcQualityGoodsImages:this.state.pcQualityPictureUrl,
                        wapQualityGoodsImages:this.state.wapQualityPictureUrl,
                    }
                    console.log(newFillData1)
                    //发起主商品修改请求
                    goodsEdit(newFillData1)
                        .then((data)=>{
                            if(data.code==200){
                                //关闭弹出层
                                dispatch({
                                    type: 'goodsManagement/modalGoods',
                                    callback: () =>{
                                    },
                                })
                                message.success('编辑成功');
                                //更新列表
                                let sendData1={"current":page,"size":10,...formValues}
                                dispatch({
                                    type: 'goodsManagement/goodsQueryList',
                                    payload: sendData1,
                                    callback: (data) => {
                                        this.props.refreshList(data)
                                    },
                                });
                            }
                            else{
                                dispatch({
                                type: 'goodsManagement/modalGoods',
                                })
                                message.error(data.msg?data.msg:'编辑失败')
                            }
                        })
                    }else{//明细商品编辑
                        const newFillData1={
                            goodsItemId:tmp_goods.id,
                            goodsId:tmp_goods.goodsId,
                            title:fieldsValue.title,
                            pcMainImages:pcPictureUrl,
                            wapMainImages:wapPictureUrl,
                            price:fieldsValue.price,
                            goodsFlag:fieldsValue.goodsFlag,
                            description:fieldsValue.description,
                            promotionId:promotionId?promotionId:0,
                            pcQualityGoodsImages:pcQualityPictureUrl,
                            wapQualityGoodsImages:wapQualityPictureUrl,
                        }
                        
                        console.log("明细商品编辑参数：",newFillData1)
                        //发起明细修改请求
                        goodsItemEdit(newFillData1)
                            .then((data)=>{
                                if(data.code==200){
                                    //关闭弹出层
                                    dispatch({
                                        type: 'goodsManagement/modalGoods',
                                        callback: () =>{
                                        },
                                    })
                                    message.success('编辑成功');
                                    //刷新明细商品列表
                                    let sendData1={"current":1,"size":10,"goodsId": tmp_goods.goodsId}
                                    dispatch({
                                        type: 'goodsManagement/goodsItemQueryList',
                                        payload: sendData1,
                                        callback: (data) => {
                                            this.props.refreshGoodsItemList(data)
                                        },
                                    });
                                }
                                else{
                                    dispatch({
                                    type: 'goodsManagement/modalGoods',
                                    })
                                    message.error(data.msg?data.msg:'编辑失败')
                                }
                            })
                }
            }) //这是validateFields的结尾
            
        }
        const qualityLine = () => {
            return (
                <Row gutter={24}>
                    <Col span={12}>
                        <FormItem 
                            label={"PC端精品商品图片"}
                            {...formItemLayout}
                            {...styleItem}
                            style={{width:'520px'}}
                            >
                            {getFieldDecorator('pcQualityGoodsImages', {
                                rules: [{ required: /*isQualityLine?true:(isQualityFlag?false:true)*/ false, message: '请上传PC端精品商品图片' }],
                                initialValue:tmp_goods.pcQualityGoodsImages?tmp_goods.pcQualityGoodsImages[0]:''
                            })(
                                <div className="clearfix">
                                 <Upload
                                    // name='file'
                                    listType="picture-card"
                                    action={this.state.UploadImgUrl}
                                    accept="image/*"//接受上传的文件类型  如：image/jpeg
                                    // beforeUpload={(file,fileList)=>this.beforeUpload(file,fileList)}
                                    onPreview={this.handlePreview}
                                    fileList={pcQualityFileList}
                                    disabled={this.props.name}
                                    showUploadList={ showUploadList } //是否展示预览和删除的小图标
                                    onChange={(info)=>{this.UploadImg(info,'pcQualityPicture')}}
                                >
                                {this.state.pcQualityPicture.length > 0? null:
                                    (
                                        <div>
                                            <Icon type="plus" />
                                            <div className="ant-upload-text">上传图片</div>
                                        </div>
                                    )
                                }
                                    {/* &nbsp;<span>(文件最大不能超过<font style={{color:'red'}}>2M</font>)</span> */}
                                </Upload> 
                                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                </Modal>
                                </div>
                            )}
                            </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem 
                            label={"移动端精品商品图片"}
                            {...formItemLayout2}
                            {...styleItem}
                            style={{width:'520px'}}
                            >
                            {getFieldDecorator('wapQualityGoodsImages', {
                                rules: [{ required: /*isQualityLine?true:(isQualityFlag?false:true)*/ false, message: '请上传移动端精品商品图片' }],
                                initialValue:tmp_goods.wapQualityGoodsImages?tmp_goods.wapQualityGoodsImages[0]:''
                            })(
                                <div className="clearfix" style={{marginLeft:'10px'}}>
                                <Upload
                                    // name='file'
                                    listType="picture-card"
                                    action={this.state.UploadImgUrl}
                                    accept="image/*"
                                    // beforeUpload={(file,fileList)=>this.beforeUpload(file,fileList)}
                                    onPreview={this.handlePreview}
                                    fileList={wapQualityFileList}
                                    disabled={this.props.name}
                                    showUploadList={ showUploadList } //是否展示预览和删除的小图标
                                    onChange={(info)=>{this.UploadImg(info,'wapQualityPicture')}}
                                >
                                {this.state.wapQualityPicture.length > 0? null:
                                    (
                                        <div>
                                            <Icon type="plus" />
                                            <div className="ant-upload-text">上传图片</div>
                                        </div>
                                    )
                                }  
                                    {/* &nbsp;<span>(文件最大不能超过<font style={{color:'red'}}>2M</font>)</span> */}
                                </Upload> 
                                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                </Modal>
                                </div>
                            )}
                            </FormItem>
                    </Col>
                </Row>
            )
        }
        //显示精品图片内容
        const isShowQuality = () => {
            if(isQualityLine){
                return (
                    qualityLine()
                )
            }else if(tmp_goods.goodsFlag=='01' && !isQualityFlag){
                return (
                    qualityLine()
                )
            }else{
                return (
                    <div></div>
                )
            }
        }
        //Upload组件的删除小图标的显示
        const showUploadList={
			// showPreviewIcon: true,
			showRemoveIcon: this.props.showRemoveIcon
		}
        return(
            <Modal
                afterClose={clearRule}
                style={{ top: 30 }}
                // title={that.editType=='goods'?'主商品修改':'明细商品修改'}
                title={this.props.modalTitle}
                visible={modalVisible}
                maskClosable={false}//点击蒙层是否允许关闭,true:允许，false:不允许
                width={850}
                // okText="保存"
                // onOk={okHandle}
                onCancel={() => handleModalVisible()}
                footer={[
                    <Button key="back" onClick={() => handleModalVisible()}>取消</Button>,
                    <Button key="submit" disabled={this.props.name} type="primary" onClick={okHandle}>
                      保存
                    </Button>,
                ]}
            >
                <Form>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem 
                                label={"商品名"}
                                {...formItemLayout}
                                {...styleItem}
                            >
                                {getFieldDecorator('title', {
                                rules: [{ 
                                    required: false, 
                                    message: '请输入商品名称' ,
                                }],
                                initialValue:tmp_goods.title?tmp_goods.title:''
                                })(
                                  <Input disabled />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem 
                                label={"PC端商品图片"}
                                {...formItemLayout}
                                {...styleItem}
                                style={{width:'430px'}}
                                >
                                {getFieldDecorator('pcMainImages', {
                                  rules: [{ required: false, message: '请上传PC端商品图片' }],
                                  initialValue:tmp_goods.pcMainImages?tmp_goods.pcMainImages[0]:''
                                })(
                                  <div className="clearfix">
                                    <Upload
                                        // name='file'
                                        listType="picture-card"
                                        action={this.state.UploadImgUrl}
                                        accept="image/*"//接受上传的文件类型  如：image/jpeg
                                        // beforeUpload={(file,fileList)=>this.beforeUpload(file,fileList)}
                                        onPreview={this.handlePreview}
                                        fileList={pcFileList}
                                        disabled={this.props.name}
                                        showUploadList={ showUploadList } //是否展示预览和删除的小图标
                                        onChange={(info)=>{this.UploadImg(info,'pcPicture')}}
                                    >
                                    {this.state.pcPicture.length > 0? null:
                                        (
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">上传图片</div>
                                            </div>
                                        )
                                    }
                                        {/* &nbsp;<span>(文件最大不能超过<font style={{color:'red'}}>2M</font>)</span> */}
                                    </Upload> 
                                    <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                    </Modal>
                                  </div>
                                )}
                              </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem 
                                label={"移动端商品图片"}
                                {...formItemLayout2}
                                {...styleItem}
                                >
                                {getFieldDecorator('wapMainImages', {
                                  rules: [{ required: false, message: '请上传移动端商品图片' }],
                                  initialValue:tmp_goods.wapMainImages?tmp_goods.wapMainImages[0]:''
                                })(
                                    <div className="clearfix">
                                    <Upload
                                        // name='file'
                                        listType="picture-card"
                                        action={this.state.UploadImgUrl}
                                        accept="image/*"
                                        // beforeUpload={(file,fileList)=>this.beforeUpload(file,fileList)}
                                        onPreview={this.handlePreview}
                                        fileList={wapFileList}
                                         disabled={this.props.name}
                                         showUploadList={ showUploadList } //是否展示预览和删除的小图标
                                        onChange={(info)=>{this.UploadImg(info,'wapPicture')}}
                                    >
                                    {this.state.wapPicture.length > 0? null:
                                        (
                                            <div>
                                                <Icon type="plus" />
                                                <div className="ant-upload-text">上传图片</div>
                                            </div>
                                        )
                                    }
                                        {/* &nbsp;<span>(文件最大不能超过<font style={{color:'red'}}>2M</font>)</span> */}
                                    </Upload> 
                                    <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                                    </Modal>
                                  </div>
                                )}
                              </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem 
                                label={"一级分类"}
                                {...formItemLayout}
                                {...styleItem}
                                >
                                {getFieldDecorator('categoryName1', {
                                    rules: [{ required: false, message: '' }],
                                    initialValue:tmp_goods.categoryName1?tmp_goods.categoryName1:''
                                    })(
                                        <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem 
                                label={"二级分类"}
                                {...formItemLayout}
                                {...styleItem}
                            >
                                {getFieldDecorator('categoryName2', {
                                    rules: [{ required: false, message: '' }],
                                    initialValue:tmp_goods.categoryName2?tmp_goods.categoryName2:''
                                    })(
                                      <Input disabled />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem 
                                label={"品牌名称"}
                                {...formItemLayout}
                                {...styleItem}
                                >
                                {getFieldDecorator('brandName', {
                                    rules: [{ required: false, message: '' }],
                                    initialValue:tmp_goods.brandName?tmp_goods.brandName:''
                                    })(
                                      <Input disabled  />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem 
                                label={"商品最低价格"}
                                {...formItemLayout}
                                {...styleItem}
                            >
                                {getFieldDecorator('price', {
                                rules: [{ 
                                    required: false, 
                                    message: '请输入商品最低价格' ,
                                }],
                                initialValue:tmp_goods.price?tmp_goods.price:''
                                })(
                                    <InputNumber 
                                        style={{width:'100%'}}
                                        min={0}
                                        max={9999999999}
                                        disabled
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem 
                                label={"商品标志"}
                                {...formItemLayout}
                                {...styleItem}
                            >
                                {getFieldDecorator('goodsFlag', {
                                rules: [{ 
                                    required: false, 
                                    message: '' ,
                                }],
                                initialValue:tmp_goods.goodsFlag?tmp_goods.goodsFlag+'':''
                                })(
                                  <Select onChange={this.lineChange} disabled={this.props.name}>
                                    <Option value="00">普通商品</Option>
                                    <Option value="01">精品线路</Option>
                                  </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <Checkbox
                                checked={this.state.checked}
                                // disabled={this.state.disabled}
                                onChange={this.onChangeTH}
                                style={{marginTop: '9px'}}
                                disabled={this.props.name}
                            >
                            </Checkbox>
                            <FormItem 
                                label={"是否特惠线路"}
                                {...formItemLayout2}
                                {...styleItem}
                                style={{display:'inline-block', marginLeft:'5px', width: '260px'}}
                                >
                                {getFieldDecorator('promotionId', {
                                    rules: [{ required: false, message: '' }],
                                    initialValue:tmp_goods?tmp_goods.promotionId+'':''
                                    })(
                                        <div>
                                            {this.state.checked?(
                                                <Select disabled={this.props.name} onChange={this.handleChange} defaultValue={(tmp_goods && tmp_goods.promotionId!=0 && lineByCityList.length > 0)?tmp_goods.promotionId:''} style={{marginLeft:'10px', width:'271px'}}>
                                                    {lineOptions}
                                                </Select>
                                            ):null}
                                        </div>
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <div>
                        {isShowQuality()}
                    </div>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormItem 
                                label={"商品描述"}
                                {...formItemLayout}
                                {...styleItem}
                                >
                                {getFieldDecorator('description', {
                                    rules: [{ required: false, message: '' }],
                                    initialValue:tmp_goods.description?tmp_goods.description:''
                                    })(
                                      <TextArea disabled={this.props.name} autosize={{ minRows: 4, maxRows: 4}} maxLength={200} placeholder="商品描述" />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}