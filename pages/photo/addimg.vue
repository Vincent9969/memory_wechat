<template>
	<view class=""> 
		<view class="title"  @tap="add()">
			新建相册
			<!-- <image src="../../static/add.png" style="width: 48rpx;height: 48rpx;margin-right: 40rpx;margin-top: 12rpx;text-align:right;"></image> -->
		</view>
		<cLabel title='所属相册' :dataText='form.selector' @getData='getData' :selectList="imgGroup"  v-model='form.selector' mode='selector'    />
		<cLabel title='相片描述' v-model='form.textarea' @handRight='handTextareaRight' :dataText='form.textarea' mode='textarea' rightIcon='cuIcon-close'    />
		<view style="margin: 20rpx 10px;">
			<label>上传相片</label>
			<an-upload-img @getImgList="getImgList"></an-upload-img>
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
					textarea:'',
					selector:''
				},
				imgGroup:[],
				imageList:[],
				index:0
			}
		},
		onLoad(){
			this.getImgGroup();
		},
		methods: {
			getImgList(imgList){
				console.log(imgList);
				this.imageList=imgList;
				
			},
			getData(e){
				this.form.selectorData = e.checkArr.value
			},
			handTextareaRight(){
				this.form.textarea = ''
			},
			handTextRight(){
				this.form.text = ''
			},
			handSubmit(){
				if(!this.form.selectorData){
					uni.showModal({ content: '请选择对应相册', showCancel: false });
					return;
				}
				if (this.imageList.length < 1) {
					uni.showModal({ content: '至少上传一张相片', showCancel: false });
					return;
				}
				if (this.imageList.length >10) {
					uni.showModal({ content: '一次性最多只能上传10张照片', showCancel: false });
					return;
				}
				this.addImg();
			},
			//添加相册
			add(){
				uni.navigateTo({
					url:'addphoto'
				})
			},
			//上传相片
			addImg() {
				var userInfo = uni.getStorageSync('userInfo');
				if (!userInfo) {
					return;
				}
				uni.showLoading({ title: '上传中' });
				var i=this.index;
				if(i>=this.imageList.length){
					console.log('所有图片上传完毕');
					uni.hideLoading();
					//上传完图片隐藏
					uni.switchTab({
						url:'index',
						success: () => {
							console.log('跳转成功')
						},
						fail: (e) => {
							console.log('跳转失败'+e)
						}
					})
					return;
				}
				uni.uploadFile({
					//该上传仅为示例,可根据自己业务修改或封装,注意:统一上传可能会导致服务器压力过大
					url: this.websiteUrl + '/img/addImg', //仅为示例，非真实的接口地址
					header: {
						'Content-Type': 'multipart/form-data'
					},
					filePath: this.imageList[i],
					name: 'file',
					formData: {
						//后台以post方式接收
						zpzxh:this.form.selectorData,
						imgdesc:this.form.textarea,
					},
					success: uploadFileRes => {
						console.log(uploadFileRes.data);
						var data=JSON.parse(uploadFileRes.data);
						console.log(data);
						if (data.status != 'success') {
							console.error(uploadFileRes.data.msg);
							uni.showModal({
								content: '上传照片失败'
							});
							uni.hideLoading();
							return;
						}
						this.index++;
						this.addImg();
					},
					fail: e => {
						console.log('e: ' + JSON.stringify(e));
						uni.hideLoading();
						console.log('发布失败');
					}
				});
			},
			//获取相册
			getImgGroup(){
				var that=this;
				var userInfo=uni.getStorageSync("userInfo");
				if(!userInfo){
					return;
				}
				uni.request({
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					url: this.websiteUrl + '/img/queryImgGroupInfoAll',
					method: 'POST',
					data: {homexh:userInfo.homegroupxh},
					success: function(info) {
						console.log(info);
						if(info.data.status!='success'){
							console.error(info.data.msg);
							return;
						}
						that.imgGroup=info.data.data;
					},
					fail: function(e) {
						console.log('获取失败了');
					},complete: () => {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style>
	.title {
		lineHeight:60rpx;
		width: 100%;
		line-height: 72rpx;
		color:#007AFF;
		font-size: 28rpx;
		box-shadow: $shadow;
		font-weight: bold;
		margin-left: 14rpx;
		background-repeat: no-repeat;
		background-position: calc(100% - 32rpx) center;
		background-image: url(../../static/add.png);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);

	}
	.bg-blue{width: 90%;background-color: #4CD964;opacity: 1;color: #FFFFFF;margin-top: 30rpx;}
</style>