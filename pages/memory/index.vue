<template>
	<view id="moments">
		<view class="moments__post" v-for="(memory,index) in memorys" :key="index">
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
					<view class="like" @tap="like(index,memory.xh)">
						<image :src="memory.islike==='0'?'../../static/index/islike.png':'../../static/index/like.png'"></image>
					</view>
					<view class="comment" @tap="comment(memory)">
						<image src="../../static/index/comment.png"></image>
					</view>
				</view>
			</view>
			<!-- 结束 post -->
		</view>

		<view class="foot" v-show="showInput">
			<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
			<!-- <chat-input @send-message="send_comment" @blur="blur" :placeholder="input_placeholder"></chat-input> -->
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>

</template>

<script>
	import postData from '../../common/index/index.post.data.js';//朋友圈数据
	
	export default {
		data() {
			return {
				initDatas:postData,
				memorys: [],//模拟数据
				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				loadMoreText: "加载中...",
				showLoadMore: false,
				pageNum:1,
				pageSize:10,
				memoryStatus:0,//memorys数据为初始函数
			}
		},
		onLoad() {
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
		},
		onShow() {
			if(this.memoryStatus==0){
				console.log('第一次加载正确memory数据');
				this.getMemory();
			}
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if(this.platform === 'ios'){
					this.windowHeight = res.size.windowHeight;
				}else{
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
					}
				}
			});
		},
		onHide() {
			uni.offWindowResize(); //取消监听窗口尺寸变化
		},
		onUnload() {
			this.max = 0,
				this.data = [],
				this.loadMoreText = "加载更多",
				this.showLoadMore = false;
		},
		onReachBottom() { //监听上拉触底事件
			console.log('onReachBottom');
			if(this.loadMoreText ==="暂无更多"){
				return;
			}
			this.showLoadMore = true;
			this.getMemory();
		},
		onPullDownRefresh() { //监听下拉刷新动作
			console.log('onPullDownRefresh');
			// 这里获取数据
			var that=this;
			that.pageNum=1;
			that.loadMoreText= "加载中...";
			that.getMemory();
			uni.stopPullDownRefresh(); //停止下拉刷新
		},
		methods: {
			//获取数据
			getMemory(){
				var that=this;
				var userInfo=uni.getStorageSync("userInfo");
				if(!userInfo){
					that.memorys=that.initDatas;
					return;
				}
				uni.showLoading();
				uni.request({
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					url: this.websiteUrl + '/memory/queryMemoryPageList',
					method: 'POST',
					data: {homeXh:userInfo.homegroupxh,pageNum:this.pageNum,pageSize:this.pageSize},
					success: function(info) {
						if(info.data.status=='error'){
							console.error(info.data.msg);
							return;
						}
						console.log(info);
						var data=info.data.data;
						if(data && data.list && data.total>0){
							if(data.pageNum==1){//第一次请求
								that.memorys=data.list;
							}else{
								that.memorys = that.memorys.concat(data.list);
							}
							var nextPage=data.nextPage;//下一页
							if(nextPage>0){
								console.log(nextPage)
								that.pageNum=nextPage;//将下一页复制给当前页
							}else{
								console.log(nextPage)
								that.loadMoreText = "暂无更多";
							}
							that.memoryStatus=1;
						}else{
							that.memorys=that.initDatas;
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
			//点赞
			like(index,memoryxh) {
				if (this.memorys[index].islike === '0') {
					this.memorys[index].islike = '1';
					this.addDz(memoryxh);
				} else {
					this.memorys[index].islike = '0';
					this.delDz(memoryxh);
				}
			},
			//点赞
			addDz(memoryxh){
				var that=this;
				var plinfo={};
				var userInfo=uni.getStorageSync("userInfo");
				plinfo.memoryxh=memoryxh;
				plinfo.plrxh=userInfo.xh;
				plinfo.type=1;
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
						console.log('点赞成功')
					},
					fail: function(e) {
						console.log('点赞失败')
					},complete: () => {
						uni.hideLoading();
					}
				});
			},
			//取消点赞
			delDz(memoryxh){
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
					data: {memoryxh:memoryxh,plrxh:userInfo.xh},
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
			//评论
			comment(memory) {
				uni.navigateTo({url:'reply?memory='+JSON.stringify(memory)});
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
