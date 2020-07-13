<template>
	<view class="content">
		<view class="header">
			<view class="uni-flex uni-row" style="align-items: center;">
				<view class="img-profile">
					<button hover-class="btn-hover" type="primary" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" withCredentials="true"><image :src="user.headurl" mode=""></image></button>
				</view>
				<view>
					<view class="nikename">{{ user.nickname }}</view>
					<view class="uni-flex uni-row">
						<view style="font-size: 24rpx;color: #f4f4f4;line-height: 1.5;">{{ user.desc?user.desc:'' }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card-item">
			<view class="card-item-content uni-flex uni-row">
				<view v-for="(item, index) in menuList1" :key="index" @tap="goPage(item.page)">
					<view class="icon-wrap">
						<image :src="'../../static/icon/' + item.icon + '.png'" mode=""></image>
						<view class="badge" v-if="item.padge > 0">{{ item.padge }}</view>
					</view>
					<view>{{ item.text }}</view>
				</view>
			</view>
		</view>
		<view class="card-item">
			<view class="card-item-content uni-flex uni-row">
				<view v-for="(item, index) in menuList2" :key="index" @tap="goPage(item.page)">
					<view class="icon-wrap">
						<image :src="'../../static/icon/' + item.icon + '.png'" mode=""></image>
						<view class="badge" v-if="item.padge > 0">{{ item.padge }}</view>
					</view>
					<view>{{ item.text }}</view>
				</view>
			</view>
		</view>
		<view class="card-item">
			<view class="card-item-content uni-flex uni-row">
				<view v-for="(item, index) in menuList3" :key="index" @tap="goPage(item.page)">
					<view class="icon-wrap">
						<image :src="'../../static/icon/' + item.icon + '.png'" mode=""></image>
						<view class="badge" v-if="item.padge > 0">{{ item.padge }}</view>
					</view>
					<view>{{ item.text }}</view>
				</view>
			</view>
		</view>
		<view class="footer" style="height: 1upx;width: 100%;"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {
				headurl: !uni.getStorageSync('userInfo').headurl ? '../../static/icon/admin_heard.png' : uni.getStorageSync('userInfo').headurl,
				nickname: !uni.getStorageSync('userInfo').nickname  ? '点击头像登录' : uni.getStorageSync('userInfo').nickname,
				desc: !uni.getStorageSync('userInfo').desc  ? '' : uni.getStorageSync('userInfo').desc
			},
			menuList1: [
				{ icon: 'home', text: '家庭组', padge: 0, page: '' },
				{ icon: 'user', text: '个人信息', padge: 0, page: '../user/edit' },
				{ icon: 'dynamic', text: '动态发布', padge: 0, page: '../memory/addmemory' },
				{ icon: 'album', text: '上传照片', padge: 0, page: '../photo/addimg' }
			],
			menuList2: [
				{ icon: 'plan', text: '计划', padge: 0, page: '' },
				{ icon: 'luckdraw', text: '抽奖', padge: 0, page: '../lotty/index' },
				{ icon: 'luckrecode', text: '抽奖记录', padge: 0, page: '' },
				{ icon: 'comment', text: '评论', padge: 0, page: '' }
			],
			menuList3: [
				{ icon: 'thumbs-up', text: '点赞', padge: 0, page: '' },
				{ icon: 'system', text: '设置', padge: 0, page: '' },
				{ icon: 'music', text: '音乐', padge: 0, page: '' },
				{ icon: 'voide', text: '视频', padge: 0, page: '' }
			]
		};
	},
	onLoad() {},
	methods: {
		goPage(path) {
			if (!path) {
				uni.showModal({
					content: '该功能尚未完成,敬请期待!'
				});
				return false;
			} else {
				uni.navigateTo({
					url: path
				});
			}
		},
		bindGetUserInfo: function(res) {
			if(uni.getStorageSync('userInfo') && uni.getStorageSync('openid')){
				return;
			}
			if (res.detail.userInfo) {
				this.appLogin();
			} else {
				uni.showToast({
					title: '授权失败',
					icon: 'none'
				});
				return false;
			}
		},
		getUserInfo: function(code) {
			var that = this;
			uni.showLoading({
				title: '加载中'
			});
			uni.getUserInfo({
				provider: 'weixin',
				withCredentials: true,
				success: infoRes => {
					console.log(infoRes.userInfo);
					uni.setStorageSync('userInfo', infoRes.userInfo);
					var user=infoRes.userInfo;
					user.code=code;
					uni.request({
						url: this.websiteUrl + '/login',
						method: 'POST',
						data: JSON.stringify(user),
						success: function(info) {
							console.log(info);
							var data=info.data.data;
							console.log(data);
							uni.setStorageSync('userInfo', data);
							uni.setStorageSync('openid', data.openid);
							that.user=data;
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
				fail: () => {
					console.log('fail了');
				},complete: () => {
					uni.hideLoading();
				}
			});
		},
		appLogin: function() {
			let that = this;
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					console.log(res);
					if (~res.provider.indexOf('weixin')) {
						//判断是否为微信环境
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								// 获取用户信息
								uni.getSetting({
									success(res) {
										console.log(res);
										if (res.authSetting['scope.userInfo']) {
											that.getUserInfo(loginRes.code);
											console.log('进入这个了！');
										} else {
											uni.showToast({
												title: '未授权',
												duration: 2000
											});
										}
									}
								});
							}
						});
					}
				}
			});
		}
	},
	onPullDownRefresh() {
		this.loadData('refresh');
		// 实际开发中通常是网络请求，加载完数据后就停止。这里仅做演示，加延迟为了体现出效果。
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 2000);
	},
	onReachBottom() {
		console.log();
	}
};
</script>

<style lang="scss" scoped>
$item-margin-bottom: 30upx;
$item-margin-side: 20upx;
$line-color: #f9f9f9;
$border-color: #aa833e;
page {
	background-color: #f6f6f6 !important;
}
.content {
	background-color: #f6f6f6;
}
.header {
	color: $uni-text-color-inverse;
	background-image: linear-gradient(40deg, rgb(210, 166, 95) 0%, rgb(239, 201, 142) 100%);
	padding: 50upx 30upx;
	margin-bottom: $item-margin-bottom;
	position: relative;
	.img-profile {
		margin-right: 30upx;
		image {
			width: 140upx;
			height: 140upx;
			border-radius: 50%;
			vertical-align: middle;
			border: 2px solid $border-color;
		}
	}
	.usertag {
		padding: 0 20upx;
		background-color: #cb9a5c;
		border-radius: 30upx;
		font-size: 24upx;
		margin-right: 20upx;
		border: 1px solid $border-color;
		line-height: 1.6;
	}
	.nikename {
		font-size: 30upx;
		margin-bottom: 10upx;
		.usertag {
			margin-left: 20upx;
			border: none;
			display: inline-block;
		}
	}
	.setting-btn {
		width: 60upx;
		height: 60upx;
		position: absolute;
		top: 40upx;
		right: 40upx;
	}
}
.card-item {
	background-color: #fff;
	border-radius: 20upx;
	margin: 0 $item-margin-side $item-margin-bottom $item-margin-side;
	text-align: center;
	.text-bold {
		font-weight: 900;
		font-size: 1.2em;
	}
	.icon-wrap {
		position: relative;
		image {
			width: 60upx;
			height: 60upx;
			vertical-align: top;
		}
		.badge {
			font-size: 20upx;
			width: 30upx;
			height: 30upx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			background-color: #dd524d;
			border-radius: 50%;
			position: absolute;
			top: 0;
			right: 0;
		}
	}
	.card-item-content {
		padding: 30upx;
		justify-content: space-between;
	}
	.card-item-block {
		border-bottom: 1px solid $line-color;
		padding: 30upx 0;
		align-items: center;
		&:first-child {
			padding-top: 0;
		}
		&:last-child {
			padding-bottom: 0;
			border-bottom: none;
		}
		& > view:first-child {
			width: 100upx;
		}
		&-title {
			font-size: 1.1em;
			font-weight: 600;
		}
		&-title,
		&-disc {
			margin-left: 30upx;
			width: 340upx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		button {
			width: 150upx;
			margin-right: 0;
		}
	}
}
.suggestion-title {
	justify-content: center;
	align-items: center;
	& > view:first-child,
	& > view:last-child {
		width: 100upx;
		height: 2upx;
		background-color: #ccc;
		margin: 0 20upx;
	}
}
.underlinetext {
	font-size: 24upx;
	color: #999;
	text-align: center;
	margin: 20upx;
}
button::after {
	border: none;
}

button {
	background-color: transparent;

	padding-left: 0;

	padding-right: 0;

	line-height: inherit;
}

button {
	border-radius: 0;
}
</style>
