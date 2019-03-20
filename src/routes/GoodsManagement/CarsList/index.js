/**
 * 
 * @description 项目说明  商品管理   车型列表
 * @author  DMY
 * @Date 2018.11.21
 * @warning  
 * 
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva'; //引入dva
import { Row, Col, Modal, Tabs, Upload, Form, Input, InputNumber, Radio, AutoComplete, Select, Icon, Table, Button, Checkbox, Dropdown, Divider, DatePicker, message, Drawer  } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import { carsTypeQueryList, carsDelete, carsInsert, carsUpdate,carsTypeId,carsDetail } from '../../../services/myManagement'
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

@Form.create()
//导入model层
@connect(({carsTypeManagement,loading}) => ({
	loading: loading.models.carsTypeManagement,
	data: carsTypeManagement
}))

export default class carsList extends PureComponent {
	//当前模块公共的数据管理的地方->state
	state = {
		pageNumber: '',  //当前页
		carsTableList:[], //车型图片列表数据
		actionUrlImg:'/admin/image/upload_to_public_read', //上传图片的url路径 图片上传--公共读
		pcPicture:[],//上传普通图片数量，PC端只能上传一张图片
		wapPicture:[],//上传普通图片数量，移动端只能上传一张图片
		pcPictureUrl:'',//临时保存上传普通图片Url，PC端只能上传一张图片
		wapPictureUrl:'',//临时保存上传普通图片Url，移动端只能上传一张图片
		pcFileList: [],//存放修改时初始化PC端图片信息
		wapFileList: [],//存放修改时初始化移动端图片信息
		previewVisible: false,//是否预览图片
		previewImage:'',//预览图片
		selectedRowKeys: [],  //选中的行
		isModal:false,
		titleType:"",
		rowSelectData:"",//当前选中行数据 
		carsId:'',//临时保存车型图片ID，以便给操作明细车型（新建、删除）时使用
		CarType: [],//商品管理--车型类型
		CarTypeCode:"",//存储车型的code
		modalTitle:'新增',//modal的标题
		extraParams:{},//存放图片信息，提供给修改详情时使用
		isDetail: false, //点击详情 默认disabled 为flase
		showRemoveIcon: true, //是否显示删除图标
		isDisabled: false, //详情Modal时禁止保存按钮
		isDisplay: 'inline-block', //是否显示提示文字
	};
	// 首次进入加载列表，即生命周期为组件加载完后执行
    componentDidMount() {
        this.queryList({
            current:1,
            size:10
		});
		carsTypeId({pcode:'CLLX'}).then((data)=>{
			if(data.code==200){
                this.setState({
                    CarType:data.data
                })
            }else{
                message.warn("网络错误")
            }
		}).catch((error)=>{
            message.warn("网络错误")
        })
    }
	queryList(params) {
        const { dispatch } = this.props; 
        dispatch({
            type: 'carsTypeManagement/saveQueryCarsType',
            payload: params,
            callback: () => {
            //将请求参数保存在model在发起请求
                dispatch({
                    type: 'carsTypeManagement/queryCarsType',
                    callback: () => {
                        this.dispList();
                    },
                });
            },
        });
    }
    dispList = ()=> {
        const cache = this.props.data.carsTypeManagementList?this.props.data.carsTypeManagementList.data:"";
		this.setState({carsTableList:cache});
    }
	onChange = (dates, dateStrings) => {
		// console.log('From: ', dates[0], ', to: ', dates[1]);
		// console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
	}

	//搜索查询
	handleSubmit = (e) => {
		e.preventDefault();
		const { form } = this.props;
        form.validateFields(['carType','createTime'],(err, fieldsValue) => {
			if (err) return;
            const values = {
				type:fieldsValue.carType?fieldsValue.carType:"",
				startime:fieldsValue.createTime?(fieldsValue.createTime[0].format('YYYY-MM-DD'))+' 00:00:00': "",
				endtime:fieldsValue.createTime?(fieldsValue.createTime[1].format('YYYY-MM-DD'))+' 23:59:59': "",
				
			};
             this.queryList(values);
		});
		this.cleanSelectedKeys();
	}
	cleanSelectedKeys = () => {
        this.setState({
            rowSelectData:'',
            selectedRowKeys:[]
        })
    };
	//选中车型图片表格圆点，当前列触发的事件
	handleRowSelectChange = (selectedRowKeys, selectedRows)=>{
		//存储当前车型图片表格选中的行信息
		this.setState({
			// selectedRowKeys:record, //存放多个选框
			rowSelectData:selectedRows[0],
            selectedRowKeys
		})
	}
	//生产搜索表单
	renderSimpleForm(editType){
		const {form, getFieldDecorator } = this.props.form;
		return(
			<Form onSubmit={this.handleSubmit} layout="inline">
					<FormItem label="车型">
					{getFieldDecorator('carType')(
						<Select placeholder="请选择车型" style={{width: 200}}>
								<Option value="">全部</Option>
							{this.state.CarType.map((item) =>
								<Option key={item.code} value={item.code}>{item.name}</Option>
							)}
						</Select>
					)}
					</FormItem> 
						<FormItem label="创建时间段">
						{getFieldDecorator('createTime')(
							<RangePicker allowClear={false} placeholder={['开始日期', '结束日期']} />
						)}
						</FormItem> 
						<span className={styles.submitButtons}>
						<Button type="primary" htmlType="submit" >查询</Button>
						<Button style={{ marginLeft: 10 }} onClick={this.handleFormReset}>重置</Button>
						</span>
			</Form>
		)
	}
	//重置表单
	handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
    }
	//车型图片表格分页器触发更新表格
    onSelectChange = (selectedRowKeys) => {
		this.setState({
			selectedRowKeys,
		})
		console.log('000'+selectedRowKeys)
        let sendData={
            current:selectedRowKeys,
            size:10
		}
		const { dispatch } = this.props;  
		let self = this;
        dispatch({
        type: 'carsTypeManagement/saveQueryCarsType',
        payload: sendData,
        callback: () => {
			//将请求参数保存在model在发起请求
				this.cleanSelectedKeys()
                dispatch({
                    type: 'carsTypeManagement/queryCarsType',
                    payload: sendData,
                    callback: () => {
                        self.dispList();
                    },
                });
        },
        });
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
			// const isJPG = info.file.type === 'image/jpeg';
			//const isPNG = info.file.type === 'image/png';
			const isLt2M = info.file.size / 1024 / 1024 < 2;
			if(!isLt2M){
				message.error('图片大于2M，请重新上传');
				if(type == 'pcPicture'){//PC端车型图片
					form.setFieldsValue({'CarPCImg':''});//将图片从form表单中删除
				}else if(type == 'wapPicture'){//移动端车型图片
					form.setFieldsValue({'CarMOBImg':''});//将图片从form表单中删除
				}
				return false
			}
			// if (!isJPG && !isPNG) {
			if(info.file.type.split('/')[0] != 'image'){
		    	message.error('只能上传图片，请重新上传!');
				return false
		    }
			// return isJPG && isPNG && isLt2M ; //文件类型判断 只能是png，jpeg，类型大小不能超过2MB
		}
		if(info.file.status =="removed"){
			confirm({
				title: '确定要删除图片?',
				okText:"确认",
				cancelText:"再想想",
				onOk() {
					if(type == 'pcPicture'){//PC端车型图片
						that.setState({
							pcFileList: [],
							pcPictureUrl: '',
							pcPicture:[],
						});
						form.setFieldsValue({'CarPCImg':''});//将图片从form表单中删除
					}else if(type == 'wapPicture'){//移动端车型图片
						that.setState({
							wapFileList: [],
							wapPictureUrl: '',
							wapPicture: []
						});
						form.setFieldsValue({'CarMOBImg':''});//将图片从form表单中删除
					}
				},
				onCancel() {},
			});
			return
		}
		if(type == 'pcPicture'){//PC端车型图片
			this.setState({
				pcPicture: info.fileList, 
				pcFileList:info.fileList
			});
		}else if(type == 'wapPicture'){//移动端车型图片
			this.setState({
				wapPicture: info.fileList, 
				wapFileList:info.fileList
			});
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
				if(type == 'pcPicture'){//PC端车型图片
					this.setState({
						pcPictureUrl: url
					});
				}else if(type == 'wapPicture'){//移动端车型图片
					this.setState({
						wapPictureUrl: url
					});
				}
			}
		} else if (info.file.status == 'error') {//如果出错
			message.error(info.file.error || '图片上传失败，请重新选择图片再次上传');
		}
	}
	//初始化图片
    initPictures(pcFileList,wapFileList){
        this.setState({
            pcPictureUrl:pcFileList.length>0?pcFileList[0].url:'',
            pcPicture:pcFileList,
            pcFileList,
            wapPictureUrl:wapFileList.length>0?wapFileList[0].url:'',
            wapPicture:wapFileList,
            wapFileList
        });
	}
	handleSecChange =(value)=>{
		this.setState({
			CarTypeCode: value
		})
	}
	render() {
		const {selectedRowKeys, rowSelectData , pcFileList, wapFileList, isDetail, isRemove, pcPictureUrl,wapPictureUrl } = this.state;
		const loading =this.props.loading
		// const { that, dispatch } = this.props;
		
		const columns = [
			{
				title: '车型',
				dataIndex: 'typeName',
				key: 'typeName'
			}, 
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime'
			},
			{
				title: '最后修改时间',
				dataIndex: 'updateTime',
				key: 'updateTime'
				// render: (text)=><span>{moment.parseZone(text).local().format('YYYY-MM-DD HH:mm')}</span>
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				render: (text, record) => {
					return (
						<Fragment>
							<a onClick = {() => onchangeType('detail',record)} > 详情 </a>
							|
							<a onClick = {() => onchangeType('modify',record)} > 修改 </a>
						</Fragment>
					)
				} 
			}
		
		];
		// //列表行选中
		const rowSelection = {
			onChange: this.handleRowSelectChange,
			selectedRowKeys:this.state.selectedRowKeys,
			type: 'radio',
		  };
		
		const { form, resetFields, getFieldDecorator } = this.props.form;
		const showUploadList={
			// showPreviewIcon: true,
			showRemoveIcon:this.state.showRemoveIcon
		}
		//分页
		const paginationProps = {
            // showSizeChanger: true,
			total:this.state.carsTableList.total,
            // showQuickJumper: true,
            onChange:this.onSelectChange,
            // ...pagination,
		};
		//记录点击的是添加/修改/详情按钮
		const onchangeType = (record,rowSelectData) =>{
			this.setState({
				rowSelectData: rowSelectData
			})
            if(record == 'addCar'){  //添加车型
				this.setState({
					isModal: true,
					titleType: record,
					modalTitle:'添加车型图片',
					isDetail: false,
					isRemove: false,
					selectedRowKeys: [],
					pcPicture: [],
					wapPicture: [],
					pcPictureUrl:'',
					wapPictureUrl:'',
					pcFileList: [],
					wapFileList: [],
					showRemoveIcon: true,
					isDisabled: false,
					isDisplay:'inline-block',
				})
			}else if(record == 'modify'){ //修改车型
				const { dispatch } = this.props;
				let extraParams = this.state.extraParams;
                this.setState({
                    isModal: true,
					titleType: record,
					modalTitle:'修改车型图片',
					isDetail: true,
					isRemove: false,
					showRemoveIcon: true,
					isDisabled: false,
					isDisplay:'inline-block',
				})
				// console.log('111'+JSON.stringify(rowSelectData))
				//根据车型ID进行查询车型图片详细信息
				carsDetail({id:rowSelectData.id}).then((data)=>{
					if(data && data.isSuccess){
						if(data.data){
							let allData = data.data;
						//判断图片是否存在
						//1、PC端图片与移动端图片同时存在
						if(allData.pcPicPath != "" && allData.movePicPath != ""){
							extraParams['existPCImage'] = true;
							const pcFileList =[{
								uid: '-1',
								name: 'pc.png',
								status: 'done',
								url: allData.pcPicPath,
							}];
							const wapFileList =[{
								uid: '-2',
								name: 'wap.png',
								status: 'done',
								url: allData.movePicPath,
							}];
							this.initPictures(pcFileList,wapFileList);
						}else if(allData.pcPicPath == "" && allData.movePicPath == ""){
							//2、PC端图片与移动端图片同时不存在
							// extraParams['existPCImage'] = false
							this.initPictures([],[]);
						}else if(allData.pcPicPath != ""  && allData.movePicPath == "") {
							//3、PC端图片存在，移动端图片不存在
							const pcFileList =[{
							uid: '-1',
							name: 'pc.png',
							status: 'done',
							url:allData.pcPicPath,
							}];
							this.initPictures(pcFileList,[]);
						}else if(allData.pcPicPath == null && allData.movePicPath != null){
							//4、PC端图片不存在，移动端图片存在
							const wapFileList =[{
							uid: '-2',
							name: 'wap.png',
							status: 'done',
							url: allData.movePicPath,
							}];
							this.initPictures([],wapFileList);
						}
						}
					}
				})
				this.setState({extraParams:extraParams});
			}else if(record == 'detail'){  //点击车型详情
				let extraParams = this.state.extraParams;
				this.setState({
                    isModal: true,
					titleType: record,
					modalTitle:'车型图片详情',
					isDetail: true,
					isRemove: true,
					showRemoveIcon:false,
					isDisabled: true,
					isDisplay: 'none',
				})
				//根据车型ID进行查询车型图片详细信息
				carsDetail({id:rowSelectData.id}).then((data)=>{
					if(data && data.isSuccess){
						if(data.data){
							let allData = data.data;
						//判断图片是否存在
						//1、PC端图片与移动端图片同时存在
						if((allData.pcPicPath != null) && (allData.movePicPath != null)){
							extraParams['existPCImage'] = true;
							const pcFileList =[{
								uid: '-1',
								name: 'pc.png',
								status: 'done',
								url: allData.pcPicPath,
							}];
							const wapFileList =[{
								uid: '-2',
								name: 'wap.png',
								status: 'done',
								url: allData.movePicPath,
							}];
							this.initPictures(pcFileList,wapFileList);
						}else if(allData.pcPicPath == null && allData.movePicPath == null){
							//2、PC端图片与移动端图片同时不存在
							this.initPictures([],[]);
						}else if((allData.pcPicPath != null && allData.pcPicPath.length > 0) && allData.movePicPath == null) {
							//3、PC端图片存在，移动端图片不存在
							const pcFileList =[{
							uid: '-1',
							name: 'pc.png',
							status: 'done',
							url:allData.pcPicPath,
							}];
							this.initPictures(pcFileList,[]);
						}else if(allData.pcPicPath == null && (allData.movePicPath != null && allData.movePicPath.length > 0)){
							//4、PC端图片不存在，移动端图片存在
							const wapFileList =[{
							uid: '-2',
							name: 'wap.png',
							status: 'done',
							url: allData.movePicPath,
							}];
							this.initPictures([],wapFileList);
						}
						}
					}
				})
			}
		}
		//删除车型
		const onDel = (rowSelectData) =>{
			if(rowSelectData.length == 0){
				message.warning("请选择至少一个车型图片");
				return
			}
			const { dispatch }=this.props;
			// let sendData={ id: carsIds }; //多选框
			let sendData={ ids:rowSelectData.id};
			let self = this;
			confirm({
				title: '温馨提示',
				content: '你确认要删除当前选中车型图片吗?',
				okText:"确认",
				cancelText:"再想想",
				onOk() { 
					carsDelete(sendData)
					.then((data)=>{
						if (data.code==200) {
							message.success('删除成功');
							self.cleanSelectedKeys()
							dispatch({
								type: 'carsTypeManagement/queryCarsType',
								callback: () => {
									self.dispList();
								},
							});
						}else{
							message.error('删除失败，'+data.msg)
						}
					})
				}
			});
		}
		
		//修改成功或新建车型成功
		const handleOk = (e) => {
			this.props.form.validateFields((err, fieldsValue) => {
				if (err) return;
				if(this.state.titleType=='addCar'){
					let sendData = {
						// typeName: fieldsValue.SelectName,
						type: this.state.CarTypeCode,
                        pcPicPath: this.state.pcPictureUrl,
						movePicPath: this.state.wapPictureUrl
					};
					// console.log(fieldsValue)
					// console.log('555555555'+JSON.stringify(fieldsValue))
					carsInsert(sendData).
					then((data) => {
						if(data.code==200){
							closeModalVisible()
							message.success('添加成功！')
							//更新列表
							let sendDataNew ={"current":1,"size":10,"startime":"","endtime":""}
							this.props.dispatch({
								type: 'carsTypeManagement/queryCarsType',
								payload: sendDataNew,
								callback: (data) => {
									this.dispList();
									this.queryList(sendDataNew);//重新加载列表
								}
							});
						}else{
							// closeModalVisible()
							let sendDataNew ={
								current:1,
								size:10,
								startime:"",
								endtime:""
							}
							this.queryList(sendDataNew)
							message.error('添加失败，'+data.msg)
						}

					})
				}else if(this.state.titleType == 'modify'){
					//车型图片编辑
					const sendData={
						id: rowSelectData.id,
						type: this.state.CarTypeCode,
						// typeName: fieldsValue.SelectName,
						pcPicPath: this.state.pcPictureUrl,
						movePicPath: this.state.wapPictureUrl,	
					}
					carsUpdate(sendData)
					.then((data) =>{
						if(data.code ==200){
							//关闭弹出层
							closeModalVisible()
							message.success('修改成功');
							this.setState({
								rowSelectData:sendData
							})
							let sendDataNew={"current":1,"size":10}
                            this.props.dispatch({
								type: 'carsTypeManagement/queryCarsType',
								payload: sendDataNew,
								callback: (data) => {
									this.dispList();
								},
                            });
						}else{
							closeModalVisible()
							message.error('编辑失败，'+data.msg)
						}
					})
					.catch((error) =>{
						message.error(error.msg)
					})
				}
			})
			
		};
		//每次关闭弹出层都将state里得单条数据缓存清空
        const clearRule = () =>{
			//重置控件状态
			this.setState({
				rowSelectData: []
			})
			resetFields();
			
		};
		const closeModalVisible = () =>{
            this.setState({
                isModal:false,
            })
		};
		
		const formItemText = {
            labelCol: {
              sm: { span: 4 },
            },
            wrapperCol: {
              sm: { span: 12 },
            },
		};
		const formItemLayout = {
			labelCol: {
			  xs: { span: 26 },
			  sm: { span: 6 },
			},
			wrapperCol: {
			  xs: { span: 24 },
			  sm: { span: 16 },
			},
		  };
		const cartTpyeOntions=this.state.CarType.map((item) =>
			<Option key={item.code} value={item.code}>{item.name}</Option>
		);
		return (
			<div className={styles.carList}>
				{/* <div className={styles.allCount}>车型列表（共{this.state.carsTableList.total}条）</div> */}
				<div className={styles.searchform}>{this.renderSimpleForm()}</div>
				<div className={styles.addBtn}>
					<Button icon="plus" type="primary" onClick={() => onchangeType('addCar')}>添加车型图片</Button>  
                    <Button icon="delete" type="primary" onClick={() => onDel(rowSelectData)}>删除</Button>
				</div>
				<Table 
					loading={loading} 
					rowKey={record => record.id}
					// rowKey={rowSelection.id}
					rowSelection={rowSelection} 
					columns={columns} 
					dataSource={this.state.carsTableList?this.state.carsTableList.records:[]} 
					pagination={paginationProps} 
					size={"small"}
				/>
				<Modal
					afterClose={clearRule} 
					title={this.state.modalTitle}
					// okText="保存"
					visible={this.state.isModal}
					width={600}
					// onOk={okHandle}
					onCancel={() => closeModalVisible()}
					// onOk={() => handleOk()}
					footer={[
						<Button key="back" onClick={closeModalVisible}>取消</Button>,
						<Button key="submit" disabled={this.state.isDisabled} type="primary" onClick={handleOk}>
						  保存
						</Button>,
					]}
				>
						<Form>
						<FormItem
								label={'车辆'} 
								{...formItemLayout}
								>
								{getFieldDecorator('SelectName', {
									rules: [
									{ required: true, message: '请选择车型' },
									],
									initialValue:this.state.titleType=='addCar'? "" : rowSelectData.typeName,
								})(
									<Select placeholder="请选择新建车型" disabled={isDetail} onChange={this.handleSecChange}>
										{cartTpyeOntions}
									</Select>									
								)}
							</FormItem>
							<FormItem label="设置PC宣传图片：" {...formItemLayout}>
								<span className={styles.tipBox} style={{display:this.state.isDisplay}}>(图片小于2M)</span>
								{getFieldDecorator('CarPCImg', {
									rules: [{ required: true, message: '请选择pc宣传图片' }],
									initialValue:this.state.titleType=='addCar' ? "" : pcPictureUrl,
								})(
									<div className={styles.upload}>
									<Upload 
									action={this.state.actionUrlImg}  
									listType="picture-card" 
									accept="image/*" 
									fileList={pcFileList}
									// disabled={isDetail}
									onPreview={this.handlePreview}
									showUploadList={ showUploadList }
									onChange={(info)=>{this.UploadImg(info,'pcPicture')}}
									>
									 {this.state.pcPicture.length > 0? null:
									 (
										<Button>
											<Icon type="upload" /> 上传
										</Button>
										)
									}
									</Upload>
									</div>
								)}
							</FormItem>
							<FormItem label="设置移动图片：" {...formItemLayout}>
							<span className={styles.tipBox} style={{display:this.state.isDisplay}}>(图片小于2M)</span>
								{getFieldDecorator('CarMOBImg', {
									rules: [{ required: true, message: '请选择移动端宣传图片' }],
									initialValue:this.state.titleType=='addCar' ? "" : wapPictureUrl,
								})(
									<div className={styles.upload}>
									<Upload 
									action={this.state.actionUrlImg}  
									listType="picture-card" 
									accept="image/*" 
									fileList={wapFileList}
									// disabled={isDetail}
									onPreview={this.handlePreview}
									showUploadList={ showUploadList }
									onChange={(info)=>{this.UploadImg(info,'wapPicture')}}
									>
									 {this.state.wapPicture.length > 0? null:
									 (
										<Button>
											<Icon type="upload" /> 上传
										</Button>
										)
									}
									</Upload>
									<Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
										<img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
									</Modal>
									</div>
								)}
							</FormItem>
						</Form>
				</Modal>
			</div>
		)
	}	
}