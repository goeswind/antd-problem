/**
 * 
 * @description 项目说明  商品管理   主商品管理列表、子商品管理列表，计费规则详情
 * @author  lvyongjian
 * @Date 2018.11.17
 * @warning  
 * 
 */

import React, { PureComponent, Fragment  } from 'react';
import { connect } from 'dva';
import { Row, Col, Tabs, Card, Form, Input, InputNumber, Radio, Tooltip, AutoComplete, Select, Icon, Table, Button, Checkbox, Dropdown, Divider, DatePicker, message, Drawer, Modal  } from 'antd';
import { routerRedux } from 'dva/router';
import $ from 'jquery'; 
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import GoodsListTable from '../../components/GoodsManagement/GoodsListTable'; //引入商品列表信息Table
import GoodsDetailListTable from '../../components/GoodsManagement/GoodsDetailListTable'; //引入商品明细列表信息Table
import GoodsModal from '../../components/GoodsManagement/GoodsModal'; //引入修改商品信息弹框
import {goodsUp, goodsDown, goodsDelete, goodsItemUp, goodsItemDown, goodsItemDelete, queryLineByCity, queryLineByCityAndDistrict} from '../../services/goodsManagement';//引入商品、商品明细上架、下架、删除请求方法
import request from '../../utils/request';
import styles from './list.less';//引入样式

const { Option } = Select;
const confirm = Modal.confirm;
const FormItem = Form.Item; 
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group; //按钮组内容
const { RangePicker } = DatePicker;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ goodsManagement, loading}) => ({
  loading: loading.models.goodsManagement,
  data: goodsManagement, 
  parentTable:loading.effects['goodsManagement/goodsQueryList'],
  childTable:loading.effects['goodsManagement/goodsItemQueryList']
}))

@Form.create()
export default class GoodsList extends PureComponent {
	constructor(props){
		super(props);
		this.state={
			page: 1, //当前的页
			pageSize: 10, //分页的记录数
			pagination:'',//主商品分页
			current:1,//主商品当前页
			paginationGoodsItem:'',//明细商品分页
			currentGoodsItem:1,//明细商品当前页
			goodsList:[],//当前的goodsList数据集合
      goodsItemList:[],//当前的goodsItemList数据集合
      billingRulesList:[],//商品计费规则列表
			formValues: {}, //表单的数据
      goodsSelectedRows: [], //主商品当前选择的row行
      goodsItemSelectedRows: [], //明细商品当前选择的row行
      drawerVisible:false,//计费规则页面是否显示，默认不显示
      goodsId:'',//临时保存主商品ID，以便给操作明细商品（上架、下架、删除）时使用
      goodsName:'',//临时保存主商品名称，以便给显示明细商品主商品名称
      minPrice:'',//价格区间：最低价
      maxPrice:'',//价格区间：最高价
      extraParams:{},//存放图片等信息，提供给修改详情时使用
      goodsUpLoading:false,//显示主商品上架loading
      goodsDownLoading:false,//显示主商品下架loading
      goodsDelLoading:false,//显示主商品删除loading
      goodsItemUpLoading:false,//显示明细商品上架loading
      goodsItemDownLoading:false,//显示明细商品下架loading
      goodsItemDelLoading:false,//显示明细商品删除loading
      isDisabled: false, //明细商品修改特惠线路不可选,
      goodsBtnType:'', //点击的是列表详情还是修改按钮
      goodsItemBtnType:'', //点击的是明细详情还是修改按钮
      isDetail: false, //点击详情 默认disabled 为flase
		  showRemoveIcon: true, //是否显示删除图标
		}
 }

  // 首次进入加载列表
  componentDidMount() {
    //加载数据
    this.queryList({
      "current":this.state.page,
      "size":this.state.pageSize,
    });
  }

	/**
   * 查找表格的内容
   */
  queryList =(params) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsManagement/goodsQueryList',
      payload:params,
  	  callback: () => {
  		  this.dispList();
  	  },
    });
  }
  //更新数据结果集合
  dispList(){
		//保存数据结果集合，提供分页，和数据表的数据等内容
    const list = this.props.data.goodsList;
    const pagination = {current:this.state.current,total:parseInt(list.total)||0};
    this.setState({goodsList:list?list.records:[],pagination:pagination});
	}
  
  //选中主商品记录信息
  handleGoodsSelectRows = (rows) => {
    this.setState({
      goodsSelectedRows: rows,
    });
  }

  //选中明细商品记录信息
  handleGoodsItemSelectRows = (rows) => {
    this.setState({
      goodsItemSelectedRows: rows,
    });
  }

  //调用子组件方法，设置Table组件selectedRowKeys为[]    GoodsListTable组件
  onRefGoods = (ref) => {
      this.goodsTable = ref;
  }
  setSelectedRowKeys(){
    //调用子组件的方法进行重新渲染数据
    this.goodsTable.setSelectedRowKeys();//页面重新加载数据
  }

  //调用子组件方法，设置Table组件selectedRowKeys为[]    GoodsDetailListTalbe组件
  onRefGoodsItem = (ref) => {
      this.goodsItemTable = ref;
  }
  setSelectedRowKeysGoodsItem(){
    //调用子组件的方法进行重新渲染数据
    this.goodsItemTable.setSelectedRowKeys();//页面重新加载数据
  }

  //调用子组件方法，初始化图片信息    GoodsModal组件
  onRefGoodsModal = (ref) => {
      this.goodsModal = ref;
  }
  initPictures(pcFileList,wapFileList){
    //调用子组件的方法进行重新渲染数据
    this.goodsModal.initPictures(pcFileList,wapFileList);//页面重新加载数据
  }
  initQualityPictures(pcQualityFileList,wapQualityFileList){
    //调用子组件的方法进行重新渲染数据
    this.goodsModal.initQualityPictures(pcQualityFileList,wapQualityFileList);//页面重新加载数据
  }
  initLineChecked(checked){
    //调用子组件的方法进行重新渲染数据
    this.goodsModal.initLineChecked(checked);//页面重新加载数据
  }

  /**
   * 简单的查询表格框 内容
   */
  renderSimpleForm(){
    const { getFieldDecorator } = this.props.form;
    const styleItem={style:{marginBottom:16}};
    return(
      <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{md:6, lg:24, xl:48}}>
            <Col md={6} sm={24}>
              <FormItem 
               {...styleItem}
              label="商品名称">
                {getFieldDecorator('title')(
                  <Input placeholder="商品名称"/>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem 
               {...styleItem}
              label="分类2">
                {getFieldDecorator('classification2')(
                  <Select placeholder="请选择">
                    <Option value="2">零担</Option>
                    <Option value="3">整车</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem 
               {...styleItem}
              label="商品状态">
                {getFieldDecorator('state')(
                  <Select placeholder="请选择">
                    <Option value="1">已上架</Option>
                    <Option value="0">未上架</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
          <Row gutter={{md:6, lg:24, xl:48}}>
            <Col md={6} sm={24}>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormGoodsUp} loading={this.state.goodsUpLoading}>上架</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormGoodsDown} loading={this.state.goodsDownLoading}>下架</Button>
                {/* <Button style={{ marginLeft: 8 }} onClick={this.handleFormGoodsDel} loading={this.state.goodsDelLoading}>删除</Button> */}
            </Col>
          </Row>
      </Form>
    );
  }

  /**
   * 全部查询条件的输入框内容
   */
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const styleItem = {style:{marginBottom:16}};

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md:6, lg:24, xl:48}}>
          <Col md={6} sm={24}>
              <FormItem 
               {...styleItem}
              label="商品名称">
                {getFieldDecorator('title')(
                  <Input placeholder="商品名称"/>
                )}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem 
               {...styleItem}
              label="分类2">
                {getFieldDecorator('classification2')(
                  <Select placeholder="请选择">
                    <Option value="2">零担</Option>
                    <Option value="3">整车</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem 
               {...styleItem}
              label="商品状态">
                {getFieldDecorator('state')(
                  <Select placeholder="请选择">
                    <Option value="1">已上架</Option>
                    <Option value="0">未上架</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem 
               {...styleItem}
              label="价格区间">
                {getFieldDecorator('minPrice')(
                  <InputNumber 
                    style={{width:'90px'}}
                    min={0}
                    max={9999999999}
                  />
                )}
                &nbsp;&nbsp;-&nbsp;&nbsp;
                {getFieldDecorator('maxPrice')(
                  <InputNumber 
                    style={{width:'90px'}}
                    min={0}
                    max={9999999999}
                  />
                )}
              </FormItem>
            </Col>
        </Row>
        <Row gutter={{md:6, lg:24, xl:48}}>
          <Col md={16} sm={24}>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormGoodsUp} loading={this.state.goodsUpLoading}>上架</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormGoodsDown} loading={this.state.goodsDownLoading}>下架</Button>
            {/* <Button style={{ marginLeft: 8 }} onClick={this.handleFormGoodsDel} loading={this.state.goodsDelLoading}>删除</Button> */}
          </Col>
          <Col md={6} sm={24} lg={6}>
            <div style={{ overflow: 'hidden', width:'280px'}}>
              <span style={{ float: 'right'}}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }

   /**
   * 渲染窗口的条件
   */
  renderForm(){
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

	//按条件查询
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    //不做任何的条件限制，可以查找出来所有的内容数据
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //将表单中填写的参数保存起来提供后面分页使用
      const valueForms = {
        "title":fieldsValue.title || '',
        "minPrice":fieldsValue.minPrice || '',
        "maxPrice":fieldsValue.maxPrice || '',
        "state":fieldsValue.state || '',
        "categoryId":fieldsValue.classification2 || ''
      }
      //存储使用,重新查询则current当前页面变为第1页
      this.setState({
        current:1,
        formValues:valueForms,
        goodsItemList: []//清空明细商品信息
      })
      //发起请求
      this.props.dispatch({
          type: 'goodsManagement/goodsQueryList',
          payload:{
              ...valueForms,
              "current":this.state.page,
              "size":this.state.pageSize},
          callback:()=>{
                this.dispList();
          }
      });
    });
  }
	
	/**
   * 主商品分页表单使用到的内容
   */
  handleStandardTableChangeGoods = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    this.setState({
       current:pagination.current

    });
    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    //排序条件
    if (sorter.field) {
      //分类1
      if(sorter.columnKey=='categoryName1'){
        if(sorter.order=='descend'){
          params.orderCondition = `category_id_1=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `category_id_1=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
      //分类2
      if(sorter.columnKey=='categoryName2'){
        if(sorter.order=='descend'){
          params.orderCondition = `category_id_2=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `category_id_2=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
      //品牌名称
      if(sorter.columnKey=='brandName'){
        if(sorter.order=='descend'){
          params.orderCondition = `brand_id=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `brand_id=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
      //商品状态
      if(sorter.columnKey=='state'){
        if(sorter.order=='descend'){
          params.orderCondition = `state=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `state=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
      //预估价
      if(sorter.columnKey=='price'){
        if(sorter.order=='descend'){
          params.orderCondition = `price=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `price=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
      //上架时间
      if(sorter.columnKey=='upTime'){
        if(sorter.order=='descend'){
          params.orderCondition = `up_time=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `up_time=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
    }
    //请求数据，返回列表数据
    dispatch({
      type: 'goodsManagement/goodsQueryList',
      payload: params,
      callback: () => {
        this.dispList();
      }
    });
  }
  
	/**
   * 明细商品分页表单使用到的内容
   */
  handleStandardTableChangeGoodsItem = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    // const { formValues } = this.state;

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});
    this.setState({
       currentGoodsItem:pagination.current
    });
    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      goodsId: this.state.goodsId,
      // ...formValues,
      // ...filters,
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    //排序条件
    if (sorter.field) {
      //状态
      if(sorter.columnKey=='state'){
        if(sorter.order=='descend'){
          params.orderCondition = `state=desc`;
        }else if(sorter.order=='ascend'){
          params.orderCondition = `state=asc`;
        }else{
          params.orderCondition = ``;
        }
      }
    }
    //请求数据，返回明细商品列表数据
    // this.queryGoodsItemList(this.state.goodsId);
    dispatch({
      type: 'goodsManagement/goodsItemQueryList',
      payload: params,
      callback: (data) => {
        const list = this.props.data.goodsItemList;
        const pagination = {current:this.state.currentGoodsItem,total:parseInt(list.total)||0};
        this.setState({goodsItemList:list?list.records:[],paginationGoodsItem:pagination});
      }
    });
	}
	
	//重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields(); //表单重新设置事件
    this.setState({ //重新设置表单的存储内容
      formValues: {},
    });
    //重新加载数据
    this.queryList({});
  }
  //判断是否有值
  isEmpty(obj){
    if(obj==null || obj.length==0){
        return true;
    }
    return false;
  }
  //点击编辑按钮--主商品
	editGoods(record,mark){
    const { dispatch } = this.props; 
    let extraParams = this.state.extraParams;
    extraParams['editType'] = 'goods';
     if(mark=='goodsDetail'){
       dispatch({
         type: 'goodsManagement/queryGoodsByID',
         payload: {goodsId:record.id},
         callback: (data) =>{
           // 促销活动多选框可选
           this.setState({
             isDisabled: false,
            })
            if(data && data.isSuccess){
              if(data.data){
                //根据主商品名（市-市）查询特惠线路信息
                dispatch({
                  type: 'goodsManagement/queryLineByCity',
                  payload: {bcityCode:data.data.startCityCode,ecityCode:data.data.endCityCode},
                  callback: (result) =>{
                    //判断特惠线路是否存在
                    if(result && result.data.length > 0 && data.data.promotionId && data.data.promotionId != "0"){
                      this.initLineChecked(true);
                    }else{
                      this.initLineChecked(false);
                    }
                  }
                });
                //判断图片是否存在
                //1、PC端图片与移动端图片同时存在
                if(!this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                  // extraParams['existPCImage'] = true;
                  const pcFileList =[{
                    uid: '-1',
                    name: 'pc.png',
                    status: 'done',
                    url: data.data.pcMainImages[0],
                  }];
                  const wapFileList =[{
                    uid: '-2',
                    name: 'wap.png',
                    status: 'done',
                    url: data.data.wapMainImages[0],
                  }];
                  this.initPictures(pcFileList,wapFileList);
                }else if(this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)){
                  //2、PC端图片与移动端图片同时不存在
                  // extraParams['existPCImage'] = false;
                  this.initPictures([],[]);
                }else if( !this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)) {
                  //3、PC端图片存在，移动端图片不存在
                  const pcFileList =[{
                    uid: '-1',
                    name: 'pc.png',
                    status: 'done',
                    url: data.data.pcMainImages[0],
                  }];
                  this.initPictures(pcFileList,[]);
                }else if(this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                  //4、PC端图片不存在，移动端图片存在
                  const wapFileList =[{
                    uid: '-2',
                    name: 'wap.png',
                    status: 'done',
                    url: data.data.wapMainImages[0],
                  }];
                  this.initPictures([],wapFileList);
                }
                //判断精品图片是否存在
                //1、PC端精品图片与移动端精品图片同时存在
                if(!this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                  const pcQualityFileList =[{
                    uid: '-3',
                    name: 'pcQuality.png',
                    status: 'done',
                    url: data.data.pcQualityGoodsImages[0],
                  }];
                  const wapQualityFileList =[{
                    uid: '-4',
                    name: 'wapQuality.png',
                    status: 'done',
                    url: data.data.wapQualityGoodsImages[0],
                  }];
                  this.initQualityPictures(pcQualityFileList,wapQualityFileList);
                }else if(this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)){
                  //2、PC端精品图片与移动端精品图片同时不存在
                  this.initQualityPictures([],[]);
                }else if(!this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)) {
                  //3、PC端精品图片存在，移动端精品图片不存在
                  const pcQualityFileList =[{
                    uid: '-3',
                    name: 'pcQuality.png',
                    status: 'done',
                    url: data.data.pcQualityGoodsImages[0],
                  }];
                  this.initQualityPictures(pcQualityFileList,[]);
                }else if(this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                  //4、PC端精品图片不存在，移动端精品图片存在
                  const wapQualityFileList =[{
                    uid: '-4',
                    name: 'wapQuality.png',
                    status: 'done',
                    url: data.data.wapQualityGoodsImages[0],
                  }];
                  this.initQualityPictures([],wapQualityFileList);
                }
            }
          }

          //弹出框
          dispatch({
            type: 'goodsManagement/modalGoods',
            callback: () =>{
            },
          })
        },
        });
        this.setState({
          extraParams:extraParams,
          goodsBtnType:mark,
          isDetail:true,
          modalTitle:'主商品详情',
          showRemoveIcon: false,
        });
     }else if(mark == 'goodsEdit') {
       dispatch({
         type: 'goodsManagement/queryGoodsByID',
         payload: {goodsId:record.id},
         callback: (data) =>{
           // 促销活动多选框可选
           this.setState({
             isDisabled: false,
            })
            if(data && data.isSuccess){
              if(data.data){
              //根据主商品名（市-市）查询特惠线路信息
              dispatch({
                type: 'goodsManagement/queryLineByCity',
                payload: {bcityCode:data.data.startCityCode,ecityCode:data.data.endCityCode},
                callback: (result) =>{
                    //判断特惠线路是否存在
                    if(result && result.data.length > 0 && data.data.promotionId && data.data.promotionId != "0"){
                      this.initLineChecked(true);
                    }else{
                      this.initLineChecked(false);
                    }
                    //判断图片是否存在
                    //1、PC端图片与移动端图片同时存在
                    if(!this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                      // extraParams['existPCImage'] = true;
                      const pcFileList =[{
                        uid: '-1',
                        name: 'pc.png',
                        status: 'done',
                        url: data.data.pcMainImages[0],
                      }];
                      const wapFileList =[{
                        uid: '-2',
                        name: 'wap.png',
                        status: 'done',
                        url: data.data.wapMainImages[0],
                      }];
                      this.initPictures(pcFileList,wapFileList);
                    }else if(this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)){
                      //2、PC端图片与移动端图片同时不存在
                      // extraParams['existPCImage'] = false;
                      this.initPictures([],[]);
                    }else if( !this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)) {
                      //3、PC端图片存在，移动端图片不存在
                      const pcFileList =[{
                        uid: '-1',
                        name: 'pc.png',
                        status: 'done',
                        url: data.data.pcMainImages[0],
                      }];
                      this.initPictures(pcFileList,[]);
                    }else if(this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                      //4、PC端图片不存在，移动端图片存在
                      const wapFileList =[{
                        uid: '-2',
                        name: 'wap.png',
                        status: 'done',
                        url: data.data.wapMainImages[0],
                      }];
                      this.initPictures([],wapFileList);
                    }
                    //判断精品图片是否存在
                    //1、PC端精品图片与移动端精品图片同时存在
                    if(!this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                      const pcQualityFileList =[{
                        uid: '-3',
                        name: 'pcQuality.png',
                        status: 'done',
                        url: data.data.pcQualityGoodsImages[0],
                      }];
                      const wapQualityFileList =[{
                        uid: '-4',
                        name: 'wapQuality.png',
                        status: 'done',
                        url: data.data.wapQualityGoodsImages[0],
                      }];
                      this.initQualityPictures(pcQualityFileList,wapQualityFileList);
                    }else if(this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)){
                      //2、PC端精品图片与移动端精品图片同时不存在
                      this.initQualityPictures([],[]);
                    }else if(!this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)) {
                      //3、PC端精品图片存在，移动端精品图片不存在
                      const pcQualityFileList =[{
                        uid: '-3',
                        name: 'pcQuality.png',
                        status: 'done',
                        url: data.data.pcQualityGoodsImages[0],
                      }];
                      this.initQualityPictures(pcQualityFileList,[]);
                    }else if(this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                      //4、PC端精品图片不存在，移动端精品图片存在
                      const wapQualityFileList =[{
                        uid: '-4',
                        name: 'wapQuality.png',
                        status: 'done',
                        url: data.data.wapQualityGoodsImages[0],
                      }];
                      this.initQualityPictures([],wapQualityFileList);
                    }
                }
              });
              
            }
          }
          //弹出框
          dispatch({
            type: 'goodsManagement/modalGoods',
            callback: () =>{
            },
          })
        },
        });
        this.setState({
          extraParams:extraParams,
          goodsBtnType:mark,
          isDetail:false,
          modalTitle:'主商品修改',
          showRemoveIcon: true,
        });
     }
    //根据主商品ID进行查询主商品详细信息
		
	}
  //点击编辑按钮--商品明细
	editGoodsDetail(record,mark){
    const { dispatch } = this.props; 
    let extraParams = this.state.extraParams;
    extraParams['editType'] = 'goodsDetail';
    if(mark=='goodsItemDetail'){
      this.setState({
        editType:'goodsDetail',
        goodsBtnType:mark,
        isDetail:true,
        modalTitle:'明细商品详情',
        showRemoveIcon: false,
      });
      
      //根据明细商品ID进行查询明细商品详细信息
      dispatch({
        type: 'goodsManagement/queryGoodsItemByID',
        payload: {goodsItemId:record.goodsItemId},
        callback: (data) =>{
          if(data && data.isSuccess){
            // 主商品列表无促销活动时，屏蔽商品明细的多选框
            if(data.data.goodsPromotionId=='0'){
                this.setState({
                  isDisabled: true,
                })
            }
            if(data.data){
              //根据明细商品名（市区-市区）查询特惠线路信息
              dispatch({
                type: 'goodsManagement/queryLineByCityAndDistrict',
                payload: {bcityCode:data.data.startCityCode,bdistrictCode:data.data.startDistrictCode,ecityCode:data.data.endCityCode,edistrictCode:data.data.endDistrictCode},
                callback: (result) =>{
                  //判断特惠线路是否存在
                  if(result && result.data.length > 0 && data.data.promotionId && data.data.promotionId != "0"){
                    this.initLineChecked(true);
                  }else{
                    this.initLineChecked(false);
                  }
                }
              });
              //判断图片是否存在
              //1、PC端图片与移动端图片同时存在
              if(!this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                const pcFileList =[{
                  uid: '-1',
                  name: 'pc.png',
                  status: 'done',
                  url: data.data.pcMainImages[0],
                }];
                const wapFileList =[{
                  uid: '-2',
                  name: 'wap.png',
                  status: 'done',
                  url: data.data.wapMainImages[0],
                }];
                this.initPictures(pcFileList,wapFileList);
              }else if(this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)){
                //2、PC端图片与移动端图片同时不存在
                this.initPictures([],[]);
              }else if(!this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)) {
                //3、PC端图片存在，移动端图片不存在
                const pcFileList =[{
                  uid: '-1',
                  name: 'pc.png',
                  status: 'done',
                  url: data.data.pcMainImages[0],
                }];
                this.initPictures(pcFileList,[]);
              }else if(this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                //4、PC端图片不存在，移动端图片存在
                const wapFileList =[{
                  uid: '-2',
                  name: 'wap.png',
                  status: 'done',
                  url: data.data.wapMainImages[0],
                }];
                this.initPictures([],wapFileList);
              }
              //判断精品图片是否存在
              //1、PC端精品图片与移动端精品图片同时存在
              if(!this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                // extraParams['existPCImage'] = true;
                const pcQualityFileList =[{
                  uid: '-3',
                  name: 'pcQuality.png',
                  status: 'done',
                  url: data.data.pcQualityGoodsImages[0],
                }];
                const wapQualityFileList =[{
                  uid: '-4',
                  name: 'wapQuality.png',
                  status: 'done',
                  url: data.data.wapQualityGoodsImages[0],
                }];
                this.initQualityPictures(pcQualityFileList,wapQualityFileList);
              }else if(this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)){
                //2、PC端精品图片与移动端精品图片同时不存在
                // extraParams['existPCImage'] = false;
                this.initQualityPictures([],[]);
              }else if(!this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)) {
                //3、PC端精品图片存在，移动端精品图片不存在
                const pcQualityFileList =[{
                  uid: '-3',
                  name: 'pcQuality.png',
                  status: 'done',
                  url: data.data.pcQualityGoodsImages[0],
                }];
                this.initQualityPictures(pcQualityFileList,[]);
              }else if(this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                //4、PC端精品图片不存在，移动端精品图片存在
                const wapQualityFileList =[{
                  uid: '-4',
                  name: 'wapQuality.png',
                  status: 'done',
                  url: data.data.wapQualityGoodsImages[0],
                }];
                this.initQualityPictures([],wapQualityFileList);
              }
            }
          }

          //弹出框
          dispatch({
            type: 'goodsManagement/modalGoods',
            callback: () =>{
            },
          })
        },
      });
      this.setState({extraParams:extraParams});
    }else if(mark=='goodsItemEdit'){
      this.setState({
        editType:'goodsDetail',
        goodsBtnType:mark,
        isDetail:false,
        modalTitle:'明细商品修改',
        showRemoveIcon: true,
      });
      //根据明细商品ID进行查询明细商品详细信息
      dispatch({
        type: 'goodsManagement/queryGoodsItemByID',
        payload: {goodsItemId:record.goodsItemId},
        callback: (data) =>{
          if(data && data.isSuccess){
            // 主商品列表无促销活动时，屏蔽商品明细的多选框
            if(data.data.goodsPromotionId=='0'){
                this.setState({
                  isDisabled: true,
                })
            }
            if(data.data){
              //根据明细商品名（市区-市区）查询特惠线路信息
              dispatch({
                type: 'goodsManagement/queryLineByCityAndDistrict',
                payload: {bcityCode:data.data.startCityCode,bdistrictCode:data.data.startDistrictCode,ecityCode:data.data.endCityCode,edistrictCode:data.data.endDistrictCode},
                callback: (result) =>{
                  //判断特惠线路是否存在
                  if(result && result.data.length > 0 && data.data.promotionId && data.data.promotionId != "0"){
                    this.initLineChecked(true);
                  }else{
                    this.initLineChecked(false);
                  }
                  //判断图片是否存在
                  //1、PC端图片与移动端图片同时存在
                  if(!this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                    const pcFileList =[{
                      uid: '-1',
                      name: 'pc.png',
                      status: 'done',
                      url: data.data.pcMainImages[0],
                    }];
                    const wapFileList =[{
                      uid: '-2',
                      name: 'wap.png',
                      status: 'done',
                      url: data.data.wapMainImages[0],
                    }];
                    this.initPictures(pcFileList,wapFileList);
                  }else if(this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)){
                    //2、PC端图片与移动端图片同时不存在
                    this.initPictures([],[]);
                  }else if(!this.isEmpty(data.data.pcMainImages) && this.isEmpty(data.data.wapMainImages)) {
                    //3、PC端图片存在，移动端图片不存在
                    const pcFileList =[{
                      uid: '-1',
                      name: 'pc.png',
                      status: 'done',
                      url: data.data.pcMainImages[0],
                    }];
                    this.initPictures(pcFileList,[]);
                  }else if(this.isEmpty(data.data.pcMainImages) && !this.isEmpty(data.data.wapMainImages)){
                    //4、PC端图片不存在，移动端图片存在
                    const wapFileList =[{
                      uid: '-2',
                      name: 'wap.png',
                      status: 'done',
                      url: data.data.wapMainImages[0],
                    }];
                    this.initPictures([],wapFileList);
                  }
                  //判断精品图片是否存在
                  //1、PC端精品图片与移动端精品图片同时存在
                  if(!this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                    // extraParams['existPCImage'] = true;
                    const pcQualityFileList =[{
                      uid: '-3',
                      name: 'pcQuality.png',
                      status: 'done',
                      url: data.data.pcQualityGoodsImages[0],
                    }];
                    const wapQualityFileList =[{
                      uid: '-4',
                      name: 'wapQuality.png',
                      status: 'done',
                      url: data.data.wapQualityGoodsImages[0],
                    }];
                    this.initQualityPictures(pcQualityFileList,wapQualityFileList);
                  }else if(this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)){
                    //2、PC端精品图片与移动端精品图片同时不存在
                    // extraParams['existPCImage'] = false;
                    this.initQualityPictures([],[]);
                  }else if(!this.isEmpty(data.data.pcQualityGoodsImages) && this.isEmpty(data.data.wapQualityGoodsImages)) {
                    //3、PC端精品图片存在，移动端精品图片不存在
                    const pcQualityFileList =[{
                      uid: '-3',
                      name: 'pcQuality.png',
                      status: 'done',
                      url: data.data.pcQualityGoodsImages[0],
                    }];
                    this.initQualityPictures(pcQualityFileList,[]);
                  }else if(this.isEmpty(data.data.pcQualityGoodsImages) && !this.isEmpty(data.data.wapQualityGoodsImages)){
                    //4、PC端精品图片不存在，移动端精品图片存在
                    const wapQualityFileList =[{
                      uid: '-4',
                      name: 'wapQuality.png',
                      status: 'done',
                      url: data.data.wapQualityGoodsImages[0],
                    }];
                    this.initQualityPictures([],wapQualityFileList);
                  }
                }
              });
            }
          }

          //弹出框
          dispatch({
            type: 'goodsManagement/modalGoods',
            callback: () =>{
            },
          })
        },
      });
    }
  }
  
  //根据主商品ID查询明细商品列表数据
  queryGoodsItemList = (goodsId) =>{
    const { dispatch } = this.props;
    const params = {
      current:1,
      size:10,
      goodsId: goodsId,
    }
    dispatch({
      type: 'goodsManagement/goodsItemQueryList',
      payload: params,
      callback: (data) => {
        const list = this.props.data.goodsItemList;
        const pagination = {current:this.state.currentGoodsItem,total:parseInt(list.total)||0};
        this.setState({goodsItemList:list?list.records:[],paginationGoodsItem:pagination});
        // this.setState({goodsItemList:list?list.records:[],paginationGoodsItem:pagination,goodsItemSelectedRows:[]});
      }
    });
  }

  //选择主商品，加载明细商品列表
  selectGood(record){
    this.setState({goodsId: record.id,goodsName: record.title});
    const { dispatch } = this.props; 
    //查询明细商品请求
    this.queryGoodsItemList(record.id);
  }
  //选择商品明细，加载商品明细计费规则
  selectGoodBillingRulesList(record){
    this.setState({
      drawerVisible: true,
      // billingRules: billingRules,
    });
    const { dispatch } = this.props;
    const params = {
      lineId: record.lineId,
      current:"1",
      size:"50"
      //这里不做分页，默认请求50条~~
    }
    dispatch({
      type: 'goodsManagement/queryBillmodelList',
      payload: params,
      callback: (data) => {
        const list = data
        if(list.data != null && list.data.records.length > 0){
          
          // const pagination = {current:this.state.currentGoodsItem,total:parseInt(list.total)||0};
          this.setState({billingRulesList:list.data?list.data.records:[]});//介里我帮你改了
        }else{
          this.setState({billingRulesList:[]});
        }
      }
    });
  }
  //关闭抽屉
  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  afterOpenModal = () => {
    this.props.onAfterOpen();
  }

  //主商品上架方法
  handleFormGoodsUp = () => {
    //组装主商品ID
    let goodsIds = [];
    const goods = this.state.goodsSelectedRows;
    const { formValues } = this.state;
    if(goods != null && goods.length > 0){
      //判断所选主商品中是存在已上架主商品，是则提示并返回，否则继续操作
      for (let index = 0; index < goods.length; index++) {
        const element = goods[index];
        if(element.state === 1){
          message.warning("所选商品存在已上架商品，上架商品不可重复上架!");
          return false;
        }
      }
      goods.forEach((r) => {
        goodsIds.push(r.id);
      });
    }else{
      message.warning("请选择至少一条主商品再进行上架操作");
      return ;
    }
    this.setState({goodsUpLoading:true});
    goodsUp({goodsId:goodsIds})
    .then((data)=>{
      //重新加载主商品数据
      if(data && data.code == 200){
        message.info("商品上架成功！");
        this.queryList({
          "current":this.state.page,
          "size":this.state.pageSize,
          ...formValues,
        });
        this.setState({
          goodsUpLoading:false,
          current: 1,
          size: 10,
          // goodsItemSelectedRows:[], //上架后取消明细的选中
        });
        this.setSelectedRowKeysGoodsItem(); 
        this.setSelectedRowKeys();//调用子组件方法，解决Table多选框选中问题
        //同步刷新明细商品列表
        this.queryGoodsItemList(this.state.goodsId);
      }
    })
  }
  //主商品下架方法
  handleFormGoodsDown = () => {
    //组装主商品ID
    let goodsIds = [];
    const goods = this.state.goodsSelectedRows;
    const { formValues } = this.state;
    if(goods != null && goods.length > 0){
      //判断所选主商品中是存在已下架主商品，是则提示并返回，否则继续操作
      for (let index = 0; index < goods.length; index++) {
        const element = goods[index];
        if(element.state === 0){
          message.warning("所选商品存在已下架商品，下架商品不可重复下架!");
          return false;
        }
      }
      goods.forEach((r) => {
        goodsIds.push(r.id);
      });
    }else{
      message.warning("请选择至少一条主商品再进行下架操作");
      return ;
    }
    this.setState({
      goodsDownLoading:true,
      current: 1,
      size: 10,
    });
    goodsDown({goodsId:goodsIds})
    .then((data)=>{
      //重新加载主商品数据
      if(data && data.code == 200){
        message.info("商品下架成功！");
        this.queryList({
          "current":this.state.page,
          "size":this.state.pageSize,
          ...formValues,
        });
        this.setState({
          goodsDownLoading:false,
          // goodsItemSelectedRows:[], //下架后取消明细的选中
        });
        this.setSelectedRowKeysGoodsItem();
        this.setSelectedRowKeys();//调用子组件方法，解决Table多选框选中问题
        //同步刷新明细商品列表
        this.queryGoodsItemList(this.state.goodsId);
      }
    })
  }
  //主商品删除方法
  handleFormGoodsDel = () => {
    //组装主商品ID
    let goodsIds = [];
    const goods = this.state.goodsSelectedRows;
    if(goods != null && goods.length > 0){
      goods.forEach((r) => {
        goodsIds.push(r.id);
      });
    }else{
      message.warning("请选择至少一条主商品再进行删除操作");
      return ;
    }
    const thisProps = this;
    confirm({
      title: '温馨提示',
      content: '你确认要删除选中记录吗?',
      okText:"确认",
      cancelText:"在想一下",
      onOk() { 
        thisProps.setState({goodsDelLoading:true});
        goodsDelete({goodsId:goodsIds})
        .then((data)=>{
          //重新加载主商品数据
          if(data && data.code == 200){
            thisProps.queryList({
              "current":thisProps.state.page,
              "size":thisProps.state.pageSize,
            });
            thisProps.setSelectedRowKeysGoodsItem();//调用子组件方法，解决Table多选框选中问题
          }else{
            message.info(data?data.msg:'商品删除失败！');
          }
          thisProps.setState({goodsDelLoading:false});
        })
      },
      onCancel() {
          
      },
    });
  }

  //明细商品上架方法
  handleFormGoodsItemUp = () => {
    //组装明细商品ID
    const goodsItmeIds = [];
    const goodsItem = this.state.goodsItemSelectedRows;
    if(goodsItem != null && goodsItem.length > 0){
      //判断所选明细商品中是存在已上架主商品，是则提示并返回，否则继续操作
      for (let index = 0; index < goodsItem.length; index++) {
        const element = goodsItem[index];
        if(element.state === 1){
          message.warning("所选商品存在已上架商品，上架商品不可重复上架!");
          return false;
        }
      }
      goodsItem.forEach((r)=>{
        goodsItmeIds.push(r.goodsItemId);
      })
    }else{
      message.warning("请选择至少一条明细商品再进行上架操作");
      return ;
    }
    this.setState({goodsItemUpLoading:true});
    goodsItemUp({goodsId:this.state.goodsId,goodsItemId:goodsItmeIds})
    .then((data)=>{
      //重新加载数据
      if(data && data.code == 200){
        // this.queryList({
        //   "current":this.state.page,
        //   "size":this.state.pageSize,
        // });
        message.info("商品上架成功！");
        //查询明细商品请求
        this.queryGoodsItemList(this.state.goodsId);
        //查询主商品请求
        this.queryList({
          "current":this.state.page,
          "size":this.state.pageSize,
        });
        this.setState({
          goodsItemUpLoading:false,
          current: 1,
          size: 10,
        });
        this.setSelectedRowKeys();
        this.setSelectedRowKeysGoodsItem();//调用子组件方法，解决Table多选框选中问题
      }
    })
  }
  //明细商品下架方法
  handleFormGoodsItemDown = () => {
    //组装明细商品ID
    const goodsItmeIds = [];
    const goodsItem = this.state.goodsItemSelectedRows;
    if(goodsItem != null && goodsItem.length > 0){
      //判断所选明细商品中是存在已下架主商品，是则提示并返回，否则继续操作
      for (let index = 0; index < goodsItem.length; index++) {
        const element = goodsItem[index];
        if(element.state === 0){
          message.warning("所选商品存在已下架商品，下架商品不可重复下架!");
          return false;
        }
      }
      goodsItem.forEach((r)=>{
        goodsItmeIds.push(r.goodsItemId);
      })
    }else{
      message.warning("请选择至少一条明细商品再进行下架操作");
      return ;
    }
    this.setState({goodsItemDownLoading:true});
    goodsItemDown({goodsId:this.state.goodsId,goodsItemId:goodsItmeIds})
    .then((data)=>{
      //重新加载数据
      if(data && data.code == 200){
        // this.queryList({
        //   "current":this.state.page,
        //   "size":this.state.pageSize,
        // });
        message.info("商品下架成功！");
        //查询明细商品请求
        this.queryGoodsItemList(this.state.goodsId);
        //查询主商品请求
        this.queryList({
          "current":this.state.page,
          "size":this.state.pageSize,
        });
        this.setState({
          goodsItemDownLoading:false,
          current: 1,
          size: 10,});
          this.setSelectedRowKeys();
        this.setSelectedRowKeysGoodsItem();//调用子组件方法，解决Table多选框选中问题
      }
    })
  }
  //明细商品删除方法
  handleFormGoodsItemDel = () => {
    //组装明细商品ID
    const goodsItmeIds = [];
    const goodsItem = this.state.goodsItemSelectedRows;
    if(goodsItem != null && goodsItem.length > 0){
      goodsItem.forEach((r)=>{
        goodsItmeIds.push(r.goodsItemId);
      })
    }else{
      message.warning("请选择至少一条明细商品再进行删除操作");
      return ;
    }
    const thisProps = this;
    confirm({
      title: '温馨提示',
      content: '你确认要删除选中记录吗?',
      okText:"确认",
      cancelText:"在想一下",
      onOk() { 
        thisProps.setState({goodsItemDelLoading:true});
        goodsItemDelete({goodsId:thisProps.state.goodsId,goodsItemId:goodsItmeIds})
        .then((data)=>{
          //重新加载数据
          if(data && data.code == 200){
            // this.queryList({
            //   "current":this.state.page,
            //   "size":this.state.pageSize,
            // });
            //查询明细商品请求
            thisProps.queryGoodsItemList(thisProps.state.goodsId);
          }else{
            message.info(data?data.msg:'商品删除失败！');
          }
          thisProps.setState({goodsItemDelLoading:false});
        })
      },
      onCancel() {
          
      },
    });
  }

  //切记：传递给子组件的方法要以箭头函数为方式，变量名的形式传递。不能直接传方法
  refreshList=(data) => {
    this.setState({goodsList:data.data.records});
  }
  //切记：传递给子组件的方法要以箭头函数为方式，变量名的形式传递。不能直接传方法
  refreshGoodsItemList=(data) => {
    this.setState({goodsItemList:data.data.records});
  }

	//渲染页面
  render() {
    const { getFieldDecorator } = this.props.form;
    const { goodsSelectedRows, goodsItemSelectedRows } = this.state;
		const goodsList = this.state.goodsList?Array.from(this.state.goodsList):'';//加载 的数据内容 
		const goodsItemList = this.state.goodsItemList?Array.from(this.state.goodsItemList):'';//加载 的数据内容 
		const billingRulesList = this.state.billingRulesList?Array.from(this.state.billingRulesList):'';//加载 的数据内容 
    // const { customerManagement: { data }, loading } = this.props;
    const {loading } = this.props;
    const parentMethods = {
      refreshList: this.refreshList,
      refreshGoodsItemList: this.refreshGoodsItemList,
    };
    //主商品基础列定义
    const columns = [
      {
        title: '分类1',
        dataIndex: 'categoryName1',
        key: 'categoryName1',
        width: 100,
        sorter: (text,record,index) => {},//排序
      },
      {
        title: '分类2',
        dataIndex: 'categoryName2',
        key: 'categoryName2',
        width: 100,
        sorter: (text,record,index) => {},//排序
      },
      {
        title: '品牌名称',
				dataIndex: 'brandName',
        width: 200,
        sorter: (text,record,index) => {},//排序
			},
      {
        title: '商品名称',
				dataIndex: 'title',
        width: 200,
        render: (text, record) => <a onClick={()=> this.selectGood(record)}>{text}</a>,
			},
      // {
      //   title: '商品图片',
			// 	dataIndex: 'goodsImage',
      //   width: 100,
      //   render:(text) => {
      //     return (
      //       <img src={text+'?x-oss-process=image/resize,h_50,w_50'} style={{ width: '50px', height: '50px', marginTop: '5px'}} />
      //     )
      //   }
      // },
      {
        title: '状态',
				dataIndex: 'state',
        width: 100,
        sorter: (text,record,index) => {},//排序
        render:(text,record,index) => {
          if(text === 1){
            return (
              <span>已上架</span>
            )
          }else{
            return (
              <span>未上架</span>
            )
          }
        }
			},
      {
        title: '预估价',
				dataIndex: 'price',
        width: 150,
        sorter: (text,record,index) => {},//排序
			},
      {
        title: '总库存',
				dataIndex: 'stockAmount',
				width: 100,
			},
      {
        title: '上架时间',
				dataIndex: 'upTime',
        width: 200,
        sorter: (text,record,index) => {},//排序
			},
      {
        title: '最后修改时间',
				dataIndex: 'updateTime',
				width: 200,
			},
			{
				title: '操作',
				dataIndex: 'audit_oper',
				fixed:'right',
        width:100,
        render: (text, record,index) => {
          if(record.state=="1"){
            return <span><a  onClick={()=> this.editGoods(record,'goodsDetail')}>详情 </a> <a href="javascript:;"><Tooltip placement="topRight" title="已上架不能修改">修改</Tooltip></a></span>
          }else if(record.state =="0"){
            return <span><a  onClick={()=> this.editGoods(record,'goodsDetail')}>详情 </a><a onClick={()=> this.editGoods(record,'goodsEdit')}> 修改</a></span>
          }
          return (
            <span>{text}</span>
          )
        },
				// render:(text, record,index) => {
				// 		return (
				// 		<Fragment>
        //         <a  onClick={()=> this.editGoods(record,'goodsDetail')}>详情</a>  
				// 				<a  onClick={()=> this.editGoods(record,'goodsEdit')}>修改</a>
				// 		</Fragment>
				// 		)
				// }
			}
    ];
    //商品明细基础列定义
    const detailColumns = [
      {
        title: '主商品名称',
				dataIndex: 'goodsName',
        width: 200,
        render: (text, record) => <span>{this.state.goodsName}</span>,
      },
      // {
      //   title: '主商品名称',
			// 	dataIndex: 'goodsItemId',
      //   width: 200,
      // },
      {
        title: '明细商品名称',
				dataIndex: 'title',
        width: 250,
        render: (text, record) => <a onClick={()=> this.selectGoodBillingRulesList(record)}>{text}</a>,
      },
      {
        title: '状态',
				dataIndex: 'state',
        width: 100,
        sorter: (text, record, index) => {},//排序
        render: (text, record, index) => {
          if(text === 1){
            return (
              <span>已上架</span>
            )
          }else{
            return (
              <span>未上架</span>
            )
          }
        }
			},
      {
        title: '里程',
				dataIndex: 'mileage',
				width: 150,
			},
      {
        title: '线路时效',
				dataIndex: 'lineHour',
				width: 150,
			},
      {
        title: '回单时效',
				dataIndex: 'returnBillHour',
				width: 150,
			},
      {
        title: '起效时间',
				dataIndex: 'startValidTime',
				width: 200,
			},
      {
        title: '失效时间',
				dataIndex: 'endValidTime',
				width: 200,
			},
			{
				title: '操作',
				dataIndex: 'audit_oper',
				fixed:'right',
        width:100,
        render: (text, record,index) => {
          if(record.state=="1"){
            return <span><a  onClick={()=> this.editGoodsDetail(record,'goodsItemDetail')}>详情 </a> <a href="javascript:;"><Tooltip placement="topRight" title="已上架不能修改">修改</Tooltip></a></span>
          }else if(record.state =="0"){
            return <span><a  onClick={()=> this.editGoodsDetail(record,'goodsItemDetail')}>详情 </a><a onClick={()=> this.editGoodsDetail(record,'goodsItemEdit')}> 修改</a></span>
          }
          return (
            <span>{text}</span>
          )
        },
				// render:(text, record,index) => {
				// 		return (
				// 		<Fragment>
				// 				<a  onClick={()=> this.editGoodsDetail(record)}>修改</a>
				// 		</Fragment>
				// 		)
				// }
			}
    ];
    //商品计费规则基础列定义
    const billingRulesColumns = [
      {
        title: '费用类型',
				dataIndex: 'feeTypeName',
				width: 150,
      },
      {
        title: '计费规则',
				dataIndex: 'billRulesName',
				width: 200,
			},
      {
        title: '规则说明',
				dataIndex: 'ruleExplain',
				width: 200,
			},
      {
        title: '车辆用途',
				dataIndex: 'carUserName',
				width: 150,
			},
      {
        title: '车辆类型',
				dataIndex: 'vehicleTypeName',
				width: 150,
			},
      {
        title: '车辆长度',
				dataIndex: 'carLengthName',
				width: 150,
      },
      {
        title: '核载重量',
				dataIndex: 'loadWeight',
				width: 150,
			},
      {
        title: '核载体积',
				dataIndex: 'loadVolume',
				width: 150,
			},
      {
        title: '区间',
				dataIndex: 'devide',
				width: 200,
			},
      {
        title: '成本价',
				dataIndex: 'costRate',
				width: 150,
			},
      {
        title: '销售价',
				dataIndex: 'rate',
				width: 150,
			},
      {
        title: '首点销售价',
				dataIndex: 'firstRate',
				width: 150,
			},
      {
        title: '以后每点销售价',
				dataIndex: 'otherRate',
				width: 150,
			},
      {
        title: '计费方式',
				dataIndex: 'billingTypeName',
				width: 150,
			},
      {
        title: '金额类型',
				dataIndex: 'mountStyleName',
				width: 150,
			},
      {
        title: '计价单位',
				dataIndex: 'billingUnitName',
				width: 150,
			},
      {
        title: '重泡比',
				dataIndex: 'ratio',
				width: 150,
			},
      {
        title: '修改人',
				dataIndex: 'updatorName',
				width: 150,
			},
      {
        title: '修改时间',
				dataIndex: 'updateTime',
				width: 200,
			},
    ];
    return (
      <div className={styles.contentWrap}>
      <Card>
		<div>
			<div className={styles.dbHead}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
        </div>
			</div>
      <Card bordered={false} sytle={{ marginTop:16,paddingTop:8}}>
			<GoodsListTable
          onRef={this.onRefGoods}
          selectedRows={goodsSelectedRows}
          // xscrcoll={xscrcoll}
					loading={this.props.parentTable}
          data={goodsList}
          onSelectRow={this.handleGoodsSelectRows}
					columns={columns}
					pagination={this.state.pagination}
					// rowOperCallback={this.rowOperCallback}
					onChange={this.handleStandardTableChangeGoods}
					// freshList={this.queryList}
				/>
      <legend>明细商品信息列表</legend>
      <div>
        <Button style={{ marginLeft: 8, marginBottom: 8 }} onClick={this.handleFormGoodsItemUp} loading={this.state.goodsItemUpLoading}>上架</Button>
        <Button style={{ marginLeft: 8, marginBottom: 8 }} onClick={this.handleFormGoodsItemDown} loading={this.state.goodsItemDownLoading}>下架</Button>
        {/* <Button style={{ marginLeft: 8, marginBottom: 8 }} onClick={this.handleFormGoodsItemDel} loading={this.state.goodsItemDelLoading}>删除</Button> */}
      </div>
			<GoodsDetailListTable
          onRef={this.onRefGoodsItem}
          selectedRows={goodsItemSelectedRows}
          // xscrcoll={xscrcoll}
					loading={this.props.childTable}
          data={goodsItemList}
          onSelectRow={this.handleGoodsItemSelectRows}
					columns={detailColumns}
					pagination={this.state.paginationGoodsItem}
					// // rowOperCallback={this.rowOperCallback}
					onChange={this.handleStandardTableChangeGoodsItem}
					// freshList={this.queryList}
				/>
        <GoodsModal 
          name={this.state.isDisabled}
          onRef={this.onRefGoodsModal}
          that={this.state.extraParams}
          formValues={this.state.formValues}//查询条件缓存数据，传递至子组件以便主商品修改保存成功后查询主商品信息
          page={this.state.current}//查询条件（当前页）缓存数据，传递至子组件以便主商品修改保存成功后查询主商品信息
          name={this.state.isDetail}  //disabled是否显示
          modalTitle={this.state.modalTitle} //modal层的头部标题
          showRemoveIcon={this.state.showRemoveIcon} //点击详情时，Upload的删除图标隐藏
          {...parentMethods}//传递给子组件父组件的方法，方便子组件完成操作后进行刷新父组件Table列表数据
        />
        {this.state.drawerVisible?(
          //添加判断，当drawerVisible=true时再显示Drawer，防止关闭Modal时父页面出现抖动现象
          <Drawer
            title="计费规则"
            width={1000}
            placement="right"
            onClose={this.onClose}
            maskClosable={true}//点击蒙层是否允许关闭
            visible={this.state.drawerVisible}
            // style={{
            //   height: 'calc(100% - 55px)',
            //   overflow: 'auto',
            //   overflowY:'scroll',
            //   marginRight: '15px',
            //   paddingBottom: 53,
            // }}
          >
            <div className={styles.standardTable}>
              <Table
                rowKey={record => record.id}
                // loading={this.state.loading}
                dataSource={billingRulesList}
                columns={billingRulesColumns}
                // pagination={paginationProps}
                // rowSelection={rowSelection}
                // onChange={this.handleTable1Change}
                pagination={false}
                scroll={{ x: 2600,y:600 }}
              />
            </div>
          </Drawer>
        ):''}
        </Card>
		</div>
    </Card>
    </div>
    );
  }
}
