<template>
	<view class="">
		<cLabel title='计划标题' v-model='form.text' @handRight='handTextRight' :flex='false' :dataText='form.text' mode='text'  rightIcon=''   />
		<cLabel title='计划内容' v-model='form.textarea' @handRight='handTextareaRight' :dataText='form.textarea' mode='textarea' rightIcon='cuIcon-close'    />
		<cLabel title='计划开始日期' :dataText='form.begindate' v-model='form.begindate'   mode='date'    /> 
		<cLabel title='计划结束日期' :dataText='form.enddate' v-model='form.enddate'   mode='date'    />
		<cLabel title='是否通知家人' @hand='handSwitch' :dataText='form.switch'  align='right'  mode='switch' rightIcon=''   />
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
					switch:true,
					textarea:'',
					begindate:'',
					enddate:'',
				},
				rules:{
					text:[
						{checkType:'maxMin',max:20,min:1,errorMsg:'长度介于 1-20 个字符'},
					],
					textarea:[
						{checkType:'maxMin',max:20,min:1,errorMsg:'长度介于 1-200 个字符'},	
					]
				}
			}
		},
		methods: {
			handTextareaRight(){
				this.form.textarea = ''
			},
			handTextRight(){
				this.form.text = ''
			},
			handRight(val){
				this.passState = this.isPass == 'password' ? 'cuIcon-attentionfill text-green' : 'cuIcon-attentionforbidfill text-gray';
				this.isPass = this.isPass == 'password' ? 'text' : 'password'
			},
			handSwitch(val){
				this.form.switch = val;
			},
			handSubmit(){
				let state = check.check(this.form, this.rules);
				if(!state){
					uni.showToast({ title:check.error, icon:'none', duration:2000 })
					return
				}else{
					uni.showToast({ title:'表单验证成功', duration:2000 })
				}
			}
		}
	}
</script>

<style>
	.bg-blue{width: 90%;background-color: #4CD964;opacity: 1;color: #FFFFFF;margin-top: 20rpx;}
</style>