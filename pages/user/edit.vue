<template>
	<view class="content container">
		<view class="uni-padding-wrap uni-common-mt">
			<form @submit="formSubmit" @reset="formReset" report-submit="true">
				<view class="uni-form-item uni-column masterinfo">
					<view class="title">头像</view>
					<view class="matser">
						<view class="avatar">
							<image :src="headurl" mode="widthFix"></image>
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-column mastername">
					<view class="title">昵称</view>
					<view class="matser">
						<input class="uni-input" name="nickname" v-model="nickname" @input="onKeyUserNameInput" placeholder="请输入用户名" />
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">手机号码</view>
					<view class="matser">
						<input class="uni-input"   name="mobile" v-model="mobile" @input="onKeyUserNameInput" placeholder="请输入手机号" />
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">性别</view>
					<radio-group name="sex" v-model="sex" @input="onKeyUserNameInput">
						<label>
							<radio value="男" name='sex' checked />男
						</label>
						<label>
							<radio value="女" name='sex' />女
						</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">生日</view>
					<view class="matser birthday">
						<picker mode="date" :value="birthday" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{birthday}}</view>
						</picker>
					</view>
				</view>
				<view class="uni-form-item uni-column mastername">
					<view class="title">家庭组</view>
					<view class="matser">
						<input class="uni-input" name="homegroupname" v-model="homegroupname" @input="onKeyUserNameInput" placeholder="请输入用户名" />
					</view>
				</view>
				<view class="uni-form-item uni-column mastername">
					<view class="title">抽奖次数</view>
					<view class="matser">
						<input class="uni-input" name="cjcs" v-model="cjcs"  disabled="disabled" />
					</view>
				</view>
				<cLabel title='备注' v-model='desc' @handRight='handTextareaRight' :dataText='desc' mode='textarea' rightIcon='cuIcon-close'    />
				<view class="uni-btn-v">
					<button formType="submit">完成</button>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	import cLabel from "@/components/cat-label/cat-label.vue"
	export default {
		components:{
			cLabel
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				pickerHidden: true,
				mobile: uni.getStorageSync("userInfo").mobile,
				sex: uni.getStorageSync("userInfo").sex,
				birthday: !uni.getStorageSync('userInfo').birthday?currentDate:uni.getStorageSync('userInfo').birthday,
				src: "../../static/img/right",
				headurl: uni.getStorageSync('userInfo').headurl,
				nickname: uni.getStorageSync('userInfo').nickname,
				homegroupname:uni.getStorageSync('userInfo').homegroupname,
				cjcs:uni.getStorageSync('userInfo').cjcs,
				desc:uni.getStorageSync('userInfo').desc,
			}
		},
		onLoad() {
			
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			handTextareaRight(){
				this.desc = ''
			},
			pickerConfirm: function(e) {
				this.pickerHidden = true
				this.chosen = e.target.value
			},
			pickerCancel: function(e) {
				this.pickerHidden = true
			},
			pickerShow: function(e) {
				this.pickerHidden = false
			},
			formSubmit: function(e) {
				if (Object.is(this.nickname, '')) {
					uni.showToast({
						title: '请输入昵称',
						icon: "none"
					});
					return false;
				}
				var userInfo=uni.getStorageSync("userInfo");
				userInfo.birthday=this.birthday;
				userInfo.mobile=this.mobile;
				userInfo.sex=this.sex;
				userInfo.nickname=this.nickname;
				userInfo.desc=this.desc;
				uni.showLoading({
					title:'加载中'
				})
				uni.request({
					url: this.websiteUrl+"/user/saveUser",
					method: "POST",
					data:JSON.stringify(userInfo),
					success: (data) => {
						uni.setStorageSync("userInfo",userInfo);
						uni.showModal({
							content:'保存成功',
							success: () => {
								uni.navigateTo({
									url:'index'
								})
							}
						})
					},
					fail: (data) => {
						console.log('数据异常');
					},complete: () => {
						uni.hideLoading();
					}
				});		
			},
			formReset: function(e) {
				console.log('清空数据');
				this.chosen = '';
			},
			onKeyUserNameInput: function(event) {
				// this.code = event.target.value;
			},
			bindDateChange: function(e) {
				this.birthday = e.target.value;
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>
<style>
	.meberInfo .uni-column {
		padding-left: 0;
	}

	.meberInfo .title {
		padding-left: 12.09px;
	}

	.mastername {
		margin-bottom: 12.09upx;
	}
	.matser 

	/* .birthday {
		display: flex;
	}

	/* .birthday image {
		width: 15.72upx;
	} */

	.masterinfo .master {
		display: flex;
		justify-content: flex-end !important;
	}

	.masterinfo {
		height: 90upx !important;
	}

	.avatar {
		border-radius: 50%;
		border: 1px solid #ccc;
		width: 90upx;
		height: 90upx;
		display: flex;
		margin-right: 36.29upx;
		float: right;
		overflow: hidden;

	}

	.uni-btn-v {
		display: flex;
		justify-content: center;
		/* flex-direction: column; */
	}

	button {
		background-color: #00686b;
		border-radius: 8px;
		color: #fff;
		width: calc(100% - 48.38upx);
		margin: auto;
		margin-left: 24.19upx;
	}

	.codebtn {
		width: 200upx;
		float: right;
		font-size: 14px;
		text-align: center;
		margin-right: 5px;
	}

	.uni-form-item {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		background: #fff;
		border-bottom: 1px solid #e3e4e5;
		height: 66.53upx;
		padding-left: 12.09upx;
		padding-right: 24.19upx;
	}

	.title {
		width: 120.96upx;
		padding: 0 !important;
	}

	.title+view,
	.title+radio-group {
		width: calc(100% - 120.96upx);
		/* flex: 1; */
		text-align: right;

	}

	.uni-common-mt {
		padding: 0;
		padding-top: 10px;
		width: 100%;
		margin-top: 0;
	}

	.meberInfo .title {
		padding-left: 12.09upx !important;
	}
	.meberInfo .matser {
		width: calc(100% - 140upx) !important;
	}
</style>
