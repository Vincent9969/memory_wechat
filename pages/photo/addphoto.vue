<template>
	<view class="">
		<cLabel title='相册名称' v-model='form.text' @handRight='handTextRight' :flex='false' :dataText='form.text' mode='text'  rightIcon=''   />
		<view style="margin: 20rpx 10px;">
			<label>上传相册封面</label>
			<an-upload-img @getImgList="getImgList" :initImgList="initImgList"></an-upload-img>
		</view>
		<view>
			<button class="bg-blue" @tap="handSubmit">提交</button>
		</view>
	</view>
</template>

<script>
	var check = require('@/common/checker.js')
	import cLabel from "@/components/cat-label/cat-label.vue"
	import anUploadImg from '@/components/an-uploadImg/an-uploadImg'
	export default {
		components:{
			cLabel,
			anUploadImg
		},
		data() {
			return {
				form:{
					text:"",
					begindate:'',
					enddate:'',
				},
				rules:{
					text:[
						{checkType:'maxMin',max:20,min:1,errorMsg:'相册名称长度介于 1-20 个字符'},
					]
				},
				imgList:[],
				initImgList:['https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK4CicE4eBicL2YnvkGky9rmqplnecTuDdsv3KR2NjlicwPH3lYn1DV1ib7kLXH4Cjbz6icJIZoZPTu8ww/132'],
			}
		},
		methods: {
			getImgList(imgList){
				console.log(imgList);
				this.imgList=imgList;
			},
			handTextRight(){
				this.form.text = ''
			},
			handSubmit(){
				let state = check.check(this.form, this.rules);
				if(!state){
					uni.showToast({ title:check.error, icon:'none', duration:2000 })
					return;
				}
				if(this.imgList.length<1){
					uni.showToast({ title:'请上传相册封面', icon:'none', duration:2000 })
					return;
				}
				if(this.imgList.length>1){
					uni.showToast({ title:'相册封面数量只能为1', icon:'none', duration:2000 })
					return;
				}
				var userInfo = uni.getStorageSync('userInfo');
				if (!userInfo) {
					return;
				}
				uni.uploadFile({
					//该上传仅为示例,可根据自己业务修改或封装,注意:统一上传可能会导致服务器压力过大
					url: this.websiteUrl + '/img/addImgGroup', //仅为示例，非真实的接口地址
					header: {
						'Content-Type': 'multipart/form-data'
					},
					filePath: this.imgList[0],
					name: 'file',
					formData: {
						//后台以post方式接收
						zpzmc: this.form.text,//相册名称
						cjrxh: userInfo.xh, //自己系统中的用户id
						homexh: userInfo.homegroupxh //家庭组序号
					},
					success: uploadFileRes => {
						console.log(uploadFileRes.data);
						var data=JSON.parse(uploadFileRes.data);
						console.log(data);
						if (data.status != 'success') {
							console.error(uploadFileRes.data.msg);
							uni.showModal({
								content: '创建相册失败'
							});
							return;
						}
						uni.navigateBack({
							delta:1
						})
					},
					fail: e => {
						console.log('e: ' + JSON.stringify(e));
						uni.hideLoading();
						console.log('创建相册失败');
					}
				});
			},
			
		}
	}
</script>

<style>
	.bg-blue{width: 90%;background-color: #4CD964;opacity: 1;color: #FFFFFF;margin-top: 30rpx;}
</style>