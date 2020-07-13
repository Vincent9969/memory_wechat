<template>
	<view class="index">
		<block v-for="(list, index) in photoList" :key="index">
			<view class="row">
				<view class="card card-list2" v-for="(item,key) in list" @click="goDetail(item)" :key="key">
					<image class="card-img card-list2-img" :src="item.zpcfmimgurl"></image>
					<text class="card-num-view card-list2-num-view">{{item.imgnum}}P</text>
					<view class="card-bottm row">
						<view class="car-title-view row">
							<text class="card-title card-list2-title">{{item.zpzmc}}</text>
						</view>
						<view @click.stop="share(item)" class="card-share-view"></view>
					</view>
				</view>
				<view class="card card-list2" style="background-color: #EFEFEF !important;" v-if="list.length==1">
					
				</view>
			</view>
		</block>
		<view style="text-align: center;color: #8F8F94;" v-if="photoList.length<1">{{noneText}}</view>
<!-- 		<text class="loadMore">加载中...</text> -->
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: false,
				photoList: [],
				showLoadMore: false,
				pageNum:1,
				pageSize:10,
				loadMoreText: "加载中...",
				noneText:'暂无相册快去个人中心添加吧',
			}
		},
		onLoad() {
			this.getPhoto();
			uni.getProvider({
				service: "share",
				success: (e) => {
					let data = [];
					for (let i = 0; i < e.provider.length; i++) {
						switch (e.provider[i]) {
							case 'weixin':
								data.push({
									name: '分享到微信好友',
									id: 'weixin'
								})
								data.push({
									name: '分享到微信朋友圈',
									id: 'weixin',
									type: 'WXSenceTimeline'
								})
								break;
							case 'qq':
								data.push({
									name: '分享到QQ',
									id: 'qq'
								})
								break;
							default:
								break;
						}
					}
					this.providerList = data;
				},
				fail: (e) => {
					console.log("获取登录通道失败", e);
				}
			});
		},
		onPullDownRefresh() {
			console.log("下拉刷新");
			var that=this;
			that.pageNum=1;
			this.showLoadMore = true;
			that.loadMoreText= "加载中...";
			that.getPhoto();
			uni.stopPullDownRefresh(); //停止下拉刷新
		},
		onReachBottom() {//监听上拉触底事件
			
			if(this.loadMoreText ==="暂无更多"){
				return;
			}
			this.showLoadMore = true;
			this.getPhoto();
		},
		methods: {
			getPhoto(){
				var that=this;
				var userInfo=uni.getStorageSync("userInfo");
				if(!userInfo){
					return;
				}
				uni.showLoading();
				uni.request({
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					url: this.websiteUrl + '/img/queryImgGroupInfoPageList',
					method: 'POST',
					data: {homexh:userInfo.homegroupxh,pageNum:this.pageNum,pageSize:this.pageSize},
					success: function(info) {
						if(info.data.status=='error'){
							console.error(info.data.msg);
							return;
						}
						console.log(info);
						var data=info.data.data;
						if(data && data.list && data.total>0){
							//将相册一行展示2个
							let list = [],
								lists = [],
								photo_data = data.list;
							for (let i = 0, length = photo_data.length; i < length; i++) {
								let index = Math.floor(i / 2);
								list.push(photo_data[i]);
								if (i % 2 == 1) {
									lists.push(list);
									list = [];
								}else if(i==(photo_data.length-1)){//最后一个相册 并且没有被保存到lists中
									lists.push(list);
								}
							}
							console.log(lists);
							if(data.pageNum==1){//第一次请求
								that.photoList=lists;
							}else{
								that.photoList = that.photoList.concat(lists);
							}
							var nextPage=data.nextPage;//下一页
							if(nextPage>0){
								console.log(nextPage)
								that.pageNum=nextPage;//将下一页复制给当前页
								this.showLoadMore = false;
								that.loadMoreText= "加载更多";
							}else{
								console.log(nextPage)
								that.loadMoreText = "暂无更多";
							}
						}
					},
					fail: function(e) {
						console.log('获取失败了');
					},complete: () => {
						uni.hideLoading();
					}
				});
			},	
			goDetail(e) {
				uni.navigateTo({
					url:"detail?data=" + encodeURIComponent(JSON.stringify(e))
				})
			},
			share(e) {
				if (this.providerList.length === 0) {
					uni.showModal({
						title: "当前环境无分享渠道!",
						showCancel: false
					})
					return;
				}
				let itemList = this.providerList.map(function (value) {
					return value.name
				})
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						uni.share({
							provider: this.providerList[res.tapIndex].id,
							scene: this.providerList[res.tapIndex].type && this.providerList[res.tapIndex].type === 'WXSenceTimeline' ? 'WXSenceTimeline' : "WXSceneSession",
							type: 0,
							title:"uni-app模版",
							summary: e.title,
							imageUrl:e.img_src,
							href:"https://uniapp.dcloud.io",
							success: (res) => {
								console.log("success:" + JSON.stringify(res));
							},
							fail: (e) => {
								uni.showModal({
									content: e.errMsg,
									showCancel:false
								})
							}
						});
					}
				})
			}
		}
	}
</script>
<style scoped>@import url("../../common/common.css"); </style>
<style>
	 page,
	view {
	    display: flex;
	}
	
	page {
	    display: flex;
	    min-height: 100%;
	    background-color: #EFEFEF;
	}
	
	template {
	    display: flex;
	    flex: 1;
	}
</style>
