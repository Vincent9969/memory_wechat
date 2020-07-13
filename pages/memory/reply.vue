<template>
	<view class="content" style="overflow-y: hidden;">
		 <!-- style="width: 100%;height:auto;position: fixed;top: 0;left: 0;overflow-y:auto;z-index: 9999;" -->
		<view id="moments">
				<view class="moments__post">
					<view class="post-left">
						<image class="post_header" :src="memory.headurl"></image>
					</view>
				
					<view class="post_right">
						<text class="post-username">{{memory.nickname}}</text>
						<view id="paragraph" class="paragraph">{{memory.content.text}}</view>
						<!-- 相册 -->
						<view class="thumbnails">
							<view :class="memory.content.images.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in memory.content.images" :key="index_images">
								<image class="gallery_img" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(memory.content.images,index_images)"></image>
							</view>
						</view>
						<!-- 资料条 -->
						<view class="toolbar">
							<view class="timestamp">{{memory.timestamp}}</view>
							<view class="like" @tap="like()">
								<image :src="memory.islike==='0'?'../../static/index/islike.png':'../../static/index/like.png'"></image>
							</view>
							<view class="comment" @tap="toggleMask()">
								<image src="../../static/index/comment.png"></image>
							</view>
						</view>
					</view>
					<!-- 结束 post -->
				</view>
		</view> 
		<review :reviewMsg="reviewMsg" :showLoadMore="showLoadMore" @refreshPl="refreshPl" @childReview="childReview" @reviewMsgFuc="reviewMsgFuc" @fatherMethod="fatherMethod" :childData="childData" ></review>
		<ygc-comment ref="ygcComment"
		    :placeholder="placeholder" 
			@pubComment="pubComment"></ygc-comment>
	</view>
</template>

<script>
	import review from '../../components/dl-review/review.vue';
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue';
	import postData from '../../common/index/index.post.data.js';//朋友圈数据
	export default {
		components: {
			review,
			ygcComment
		},
		data() {
			return {
				memory:{},
				type:'show',
				posts: postData,//模拟数据
				placeholder:'发布评论',
				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				
				showLoadMore: 'none',
				//评论详情
				childData:[],
				// 评论列表
				reviewMsg: [],
				pageNum:1,
				pageSize:10,
				//评论回复
				plhf:{},
				pltype:1,//1评论动态 2回复
				
				
			}
		},
		onLoad(e) {
			console.log(e);
			var memory=JSON.parse((e.memory));
			console.log(memory);
			this.memory=memory;
			this.getMemoryPl();
		},
		methods: {
			//获取评论数据
			getMemoryPl(){
				var that=this;
				uni.showLoading();
				uni.request({
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					url: this.websiteUrl + '/memory/queryMemoryPLPageList',
					method: 'POST',
					data: {memoryXh:this.memory.xh,pageNum:this.pageNum,pageSize:this.pageSize},
					success: function(info) {
						if(info.data.status=='error'){
							console.error(info.data.msg);
							return;
						}
						console.log(info);
						var data=info.data.data;
						if(data && data.list && data.total>0){
							if(data.pageNum==1){//第一次请求
								that.reviewMsg=data.list;
							}else{
								that.reviewMsg = that.reviewMsg.concat(data.list);
							}
							var nextPage=data.nextPage;//下一页
							if(nextPage>0){
								that.pageNum=nextPage;//将下一页复制给当前页
							}else{
								that.showLoadMore = "noMore";
							}
						}else{
							that.showLoadMore = "none";
						}
					},
					fail: function(e) {
						
						uni.showToast({
							title: '获取用户信息失败',
							duration: 2000
						});
						console.log('获取失败了');
					},complete: () => {
						uni.hideLoading();
					}
				});
			},
			//加载更多评论回复
			childReview(data) {
				console.log(data);
				this.childData = data.childdata;
			},
			//回复评论
			reviewMsgFuc(username,userxh,plxh){
				console.log(username,userxh,plxh);
				this.placeholder='回复:'+username,
				this.$refs.ygcComment.toggleMask(this.type);
				this.plhf={};//清空回复
				this.plhf.plxh=plxh;
				this.plhf.plrxh=userxh;
				this.pltype=2;
				
			},
			//重新加载评论列表
			refreshPl(){
				this.pageNum=1;
				this.getMemoryPl();
			},
			//下拉加载更多评论
			fatherMethod(){ 
				this.getMemoryPl();
			},
			//唤起评论弹窗
			toggleMask() {
				this.pltype=1;
				this.placeholder='发布评论',
				this.$refs.ygcComment.toggleMask(this.type);
			},
			//发布评轮按钮回调
			pubComment(commentContent) {
				this.$refs.ygcComment.toggleMask();
				if(this.pltype==1){
					this.addMemoryPL('2',commentContent)
				}else{
					this.adPLHF(commentContent);
				}
				
			},
			//点赞
			like() {
				if (this.memory.islike === '0') {
					this.memory.islike = '1';
					this.addMemoryPL('1');
				} else {
					this.memory.islike = '0';
					this.delMemoryPL('1');
				}
				
			},
			//添加评论回复
			adPLHF(commentContent){
				var that=this;
				var hfinfo=that.plhf;
				var userInfo=uni.getStorageSync("userInfo");
				hfinfo.memoryxh=that.memory.xh;
				hfinfo.hfrxh=userInfo.xh;
				hfinfo.hfnr=commentContent;
				uni.request({
					url: that.websiteUrl + '/memory/addMemoryPLHF',
					method: 'POST',
					data: JSON.stringify(hfinfo),
					success: function(info) {
						console.log(info);
						if(!info.data.status==='success'){
							console.error(info.data.msg);
							return;
						}
						uni.showToast({
							title:'回复成功',
							icon:'none',
							success: () => {
								that.refreshPl();
							}
						})
					},
					fail: function(e) {
						console.log('获取失败了');
					},complete: () => {
						uni.hideLoading();
					}
				});
			},
			//添加动态评论
			addMemoryPL(type,commentContent){
				var that=this;
				var plinfo={};
				var userInfo=uni.getStorageSync("userInfo");
				plinfo.memoryxh=this.memory.xh;
				plinfo.plrxh=userInfo.xh;
				plinfo.type=type;
				plinfo.plnr=commentContent;
				uni.request({
					url: this.websiteUrl + '/memory/addMemoryPL',
					method: 'POST',
					data: JSON.stringify(plinfo),
					success: function(info) {
						console.log(info);
						if(info.data.status!='success'){
							console.error(info.data.msg);
							return;
						}
						uni.showToast({
							title:'评论成功',
							icon:'none',
							success: () => {
								that.refreshPl();
							}
						})
					},
					fail: function(e) {
						console.log('获取失败了');
					},complete: () => {
						uni.hideLoading();
					}
				});
			},
			//取消点赞
			delMemoryPL(){
				var that=this;
				var userInfo=uni.getStorageSync("userInfo");
				if(!userInfo){
					return;
				}
				uni.request({
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					url: this.websiteUrl + '/memory/delDz',
					method: 'POST',
					data: {memoryxh:this.memory.xh,plrxh:userInfo.xh},
					success: function(info) {
						console.log(info);
						if(info.data.status!='success'){
							console.error(info.data.msg);
							return;
						}
						console.log("取消点赞成功");
					},
					fail: function(e) {
						console.log('获取失败了');
					},complete: () => {
						uni.hideLoading();
					}
				});
			},
			//照片预览
			previewImage(imageList, image_index) {
				var current = imageList[image_index];
				uni.previewImage({
					current: current,
					urls: imageList
				});
			}
		}
	}
</script>
<style scoped>
	@import url("../../common/index/index.css");
</style>
<style>
	.content {
		width: 100%;
		height: 100%;
	}
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
</style>

