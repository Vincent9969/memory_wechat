<template>
	<view :class="cstyle" class="cLabelT " >
		<view v-if="mode != 'img' && mode != 'textarea'" :class="['c-'+size,disabled ? 'disabled':'']" class="cLabel" :style="flex ? 'display: flex;' : ''">
			<view class="cLabel-l text-cut" v-if="title" :class="flex ? 'flex-l': 'noflex'">{{title}}</view>
			<view class="cLabel-mw" >
				<view class="cLabel-m text-cut" :style="{'text-align':align}">
					<!-- mode='' -->
					<view v-if="mode == ''"  >{{dataText}}</view>
					<!-- mode='text' || 'nrmber' || 'idcard' -->
					<view v-if="mode == 'text'" style="color: #808080;" >
						<input :class="disabled ? 'disabledInp': ''" confirm-type="next"  placeholder-class="input-placeholder" type="text" @input='handInput' :disabled='disabled'   @blur="handBlur" v-model="inputValue"  :placeholder="placeholder? placeholder : '点击输入'+title " />
					</view>
					<view v-if="mode == 'number'"  >
						<input :class="disabled ? 'disabledInp': ''" confirm-type="next"  placeholder-class="input-placeholder" type="number" @input='handInput' :disabled='disabled' @blur="handBlur" v-model="inputValue" :placeholder="placeholder? placeholder : '点击输入'+title " />
					</view>
					<view v-if="mode == 'idcard'"  >
						<input :class="disabled ? 'disabledInp': ''" confirm-type="next" placeholder-class="input-placeholder"  type="idcard" @input='handInput' :disabled='disabled' @blur="handBlur" v-model="inputValue" :placeholder="placeholder? placeholder : '点击输入'+title " />
					</view>
					<view v-if="mode == 'password'"  >
						<input :class="disabled ? 'disabledInp': ''" confirm-type="next"  placeholder-class="input-placeholder" type="text" password @input='handInput' :disabled='disabled' @blur="handBlur" v-model="inputValue" :placeholder="placeholder? placeholder : '点击输入'+title " />
					</view>
					<!-- mode='switch' -->
					<view v-if="mode == 'switch'">
						<switch @change="switchChange"  :class="dataText?'checked':''" :disabled='disabled'  :checked="dataText?true:false"></switch>
					</view>
					
					
					
					<!-- moed='selector' -->
					<view v-if="mode == 'selector'" >
						<view v-if="mode == 'selector'"  @tap="toggle('selector')" class="" style="text-align: right;padding-right: 10rpx;color: #808080;">{{ nData }}</view> 
						<cPicker
							v-if="mode == 'selector'"
						    mode="selector" 
							:defaultVal="defaultVal" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="selector" 
						    :themeColor="themeColor"
							:selectList="selectList"
						></cPicker>
					</view>
					
					<!-- moed='half' -->
					<view v-if="mode == 'half'" >
						<view v-if="mode == 'half'"  @tap="toggle('half')" class="">{{ nData}}</view>
						<cPicker
							v-if="mode == 'half'"
						    mode="half" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="half" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='date' -->
					<view v-if="mode == 'date'" >
						<view v-if="mode == 'date'"  @tap="toggle('date')" class="" style="text-align: right;padding-right: 10rpx;color: #808080;">{{ nData }}</view>
						<cPicker
							v-if="mode == 'date'"
						    mode="date" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="date" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='yearMonth' -->
					<view v-if="mode == 'yearMonth'" >
						<view v-if="mode == 'yearMonth'"  @tap="toggle('yearMonth')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'yearMonth'"
						    mode="yearMonth" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="yearMonth" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='dateTime' -->
					<view v-if="mode == 'dateTime'" >
						<view v-if="mode == 'dateTime'"  @tap="toggle('dateTime')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'dateTime'"
						    mode="dateTime" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="dateTime" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='dateTime' -->
					<view v-if="mode == 'range'" >
						<view v-if="mode == 'range'"  @tap="toggle('range')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'range'"
						    mode="range" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="range" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='time' -->
					<view v-if="mode == 'time'" >
						<view v-if="mode == 'time'"  @tap="toggle('time')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'time'"
						    mode="time" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="time" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='region' -->
					<view v-if="mode == 'region'" >
						<view v-if="mode == 'region'"  @tap="toggle('region')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'region'"
						    mode="region" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="region" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='selector' -->
					<!-- <view v-if="mode == 'selector'" >
						<view v-if="mode == 'selector'"  @tap="toggle('selector')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'selector'"
						    mode="selector" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="selector" 
						    :themeColor="themeColor"
						></cPicker>
					</view> -->
					<!-- moed='limit' -->
					<view v-if="mode == 'limit'" >
						<view v-if="mode == 'limit'"  @tap="toggle('limit')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'limit'"
						    mode="limit" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="limit" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					<!-- moed='limitHour' -->
					<view v-if="mode == 'limitHour'" >
						<view v-if="mode == 'limitHour'"  @tap="toggle('limitHour')" class="">{{nData}}</view>
						<cPicker
							v-if="mode == 'limitHour'"
						    mode="limitHour" 
						    :startYear="startYear" 
						    :endYear="endYear"
						    :defaultVal="defaultVal" 
						    :current="current" 
						    @confirm="hand"
						    :disabledAfter="true"
						    ref="limitHour" 
						    :themeColor="themeColor"
						></cPicker>
					</view>
					
					
				</view>
				<view   v-if="rightText || rightIcon" @tap="handRight">
					<view @tap="toggle('selector')" v-if="mode == 'selector'"  :class="rightIcon">{{rightText}}</view>
					<image @tap="toggle('date')" v-if="mode == 'date'" src="../../static/icon/date.png" style="width: 40rpx;height: 40rpx;"></image>
				</view>
				<!-- <view   v-if="rightIcon" >
					<view  ></view>
				</view> -->
			</view>
		</view>
		
		<!-- mode = 'textarea' -->
		<view class="cLabel" v-if="mode == 'textarea'"   :class="['c-'+size,disabled ? 'disabled':'']">
			<view class="textarea-t">
				<view class="cLabel-l text-cut textarea-l" v-if="title" >{{title}}</view>
				<view class="subTitle" v-if="subTitle">{{subTitle}}</view>
				<view class="cLabel-r" v-if="rightIcon">
					<view :class="rightIcon" @tap="handRight"></view>
				</view>
			</view>
			
			<view v-if="mode == 'textarea'" class='c-textarea' >
				<textarea :placeholder="placeholder? placeholder : '点击输入'+title " :disabled='disabled' id="forFocus" v-model="inputValue"  @input="handInput" @blur="handBlur" :maxlength="maxlength"></textarea>
				<label v-if="showNumber" for="forFocus" class="c-textarea-count ">{{textateaL}}/{{maxlength}}</label>
			</view>
		</view>
		<!-- mode='img' -->
		<view class="cLabel" v-if="mode == 'img'"   :class="['c-'+size,disabled ? 'disabled':'']">
			<view v-if="title" class="cLabel-l img-l"  >
				<view class="text-lg">
					<view>{{title}}</view>
					<view class="subTitle" v-if="subTitle">{{subTitle}}</view>
				</view>
				<view class="action">
					{{cimgs.length}}/{{imgL}}
				</view>
			</view>
			<view class="grid col-4 grid-square flex-sub ">
				<view class="bg-img" v-for="(item,index) in cimgs" :key="index" @tap="ViewImage(index)" >
					<image :src="cimgs[index]" mode="aspectFill"></image>
					<view v-if="imgType != 'show'" class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="cimgs.length<imgL && imgType != 'show'">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
			<cpImg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNumber" :fixOrientation="cpimgFixOrientation" :size="cpimgSize" :maxWidth="cpimgMaxWidth" :ql="cpimgQl" :type="cpimgType"  />
		</view>
	</view>
</template>

<script>
	
	import cPicker from "../c-picker/c-picker.vue"
	import cpImg from "../c-upload/cpimg.vue"
	import {picker} from "../mixins/picker.js"
	function oneOf (value, validList) {
		for (let i = 0; i < validList.length; i++) {
		  if (value === validList[i]) {
			return true;
		  }
		}
		throw new Error('mode无效，请选择有效的mode!');
		return false;
	}
	export default {
		mixins:[picker],
		components:{
			cPicker,
			cpImg
		},
		props:{
			// 主体
			mode:{
				type:String,
				validator(mode){
					let modeList=['','text','number','idcard','switch','textarea','password','img','selector','half','date', 'dateTime', 'yearMonth','time','region','selector','limit','limitHour','range']
					return oneOf(mode,modeList);
				},
				default:"",
			},
			disabled:{
				type:Boolean,
				default:false,
			},
			// 样式类
			cstyle:{
				type:String,
				default:"",
			},
			size:{    // medium small mini
				type:String,
				default:"small",
			},
			flex:{
				type:Boolean,
				default:true,
			},
			align:{		// left center right
				type:String,
				default:'left',
			},
			// 文字类
			title:{			
				type:String,
				default:"默认占位符",
			},
			dataText:{
				default:"默认占位符",
				type:[String , Number , Boolean],
			},
			placeholder:{
				type:String,
			},
			maxlength:{
				type:[Number,String],
				default:200
			},
			rightText:{
				type:String,
			},
			// 状态
			showNumber:{
				type:Boolean,
				default:true,
			},
			clear:{
				type:Boolean,
				default:false,
			},
			// 修饰类
			rightIcon:{
				type:String,
				default:'cuIcon-right'
			},
			// mode = 'img'
			imgType:{  				//shou -展示  add - 正常添加  edit-修改
				type:String,
				default:'add',
			},
			subTitle:{
				type:String,
				default:'',
			},
			imgL:{
				type:Number,
				default:9,
			},
			imgs:{
				type:Array,
				default:()=>[]
			},
			cpimgSize:{		//照片大小超过此值就压缩，且最大宽高等于maxWidth
				type:Number,
				default:500
			},				
			cpimgMaxWidth:{//照片宽高超过此值就压缩，且最大宽高等于此值
				type:Number,
				default:750
			},			
			cpimgQl:{//照片压缩比 0-1	
				type:Number,
				default:0.92
			},				
			cpimgType:{
				type:String,
				default:'url'
			},				//照片压缩后返回的格式  base64	
			cpimgFixOrientation:{
				type:Boolean,
				default:true
			},	//是否修正图片方向（暂时只支持H5）
			cpimgNumber:{
				type:Number,
				default:1
			}				//一次压缩图片数量（不支持H5）
			
		},
		data() {
			return {
				inputValue:undefined,
				textateaL:0,
				cimgs:this.imgs,
				
				nData:'请选择',
				
				modeList:['half','date', 'dateTime', 'yearMonth','time','region','selector','limit','limitHour','range']
			};
		},
		watch:{
			dataText(val){
				// if(this.mode == 'text' || this.mode == 'number' || this.mode == 'idcard' || this.mode == 'textarea'){
				// 	this.inputValue = this.dataText
				// }
				console.log("dataText");
				console.log(val);
				this.inputValue = this.dataText
				this.nData = this.dataText ? this.dataText : this.placeholder ? this.placeholder : '点击选择'+ this.title
			}
		},
		created() {
			this.inputValue=this.dataText;
		},
		methods:{
			toggle(val){
				if(this.disabled){
					return
				}
				this.$refs[val].show();
			},
			hand(value){
				this.$emit('input',value.result)
				this.$emit('getData',value)
			},
			handRight(){
				this.$emit('handRight')
			},
			switchChange(value){
				this.$emit('hand',value.detail.value)
			},
			
			// 
			handInput(value){
				let val = value.detail.value;
				if(this.mode == 'textarea'){
					this.textateaL = val.length;
				}
				this.$emit('input',val)
			},
			handBlur(value){
				let val = value.detail.value;
				// if(this.mode == 'idcard'){
				// 	if(!this.cardPatt.test(val)){
				// 		uni.showToast({ title:'请正确输入身份证号码', icon:'none' ,mask:true,duration:2000})
				// 		return
				// 	}
				// }
				this.$emit('blur',val)
			},
			
			// img
			// 图片选择
			ChooseImage() {
				this.$refs.cpimg._changImg()
			},
			// 
			cpimgOk(val){
				if(val){
					this.cimgs = this.cimgs.length != 0 ? this.cimgs.concat(val) : val;
					this.$emit('hand',this.cimgs)
				}
			},
			cpimgErr(val){
				console.log(val)
			},
			// 删除图片
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该项吗？',
					cancelText: '再看看',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.cimgs.splice(e.currentTarget.dataset.index, 1)
							this.$emit('hand',this.cimgs)
						}
					}
				})
			},
			// 预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.cimgs,
					current: e
				});
			},
		}
	}
</script>

<style lang="scss">
	.cLabelT{position: relative;}
	.cLabel{
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid rgba(0,0,0,.1);
	}
	.cLabel-mw{display: flex;justify-content: space-between;flex: 2;align-items: center;}
	.cLabel-m{flex: 2;}
	.text-cut{
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	// .flex-l{width:calc(4em + 15px)}
	.noflex{margin-bottom: 15px;}
	
	.cLabel-r{margin-left: 10px;}
	// sizeh
	.c-mini{padding: 5px 0;margin: 0 5px;font-size: 13px;font-weight: 400;}
	.c-small{ padding: 10px 0;margin: 0 10px;font-size: 15px;font-weight: 500;}
	.c-medium{ padding: 10px 0;margin: 0 10px;font-size: 16px;font-weight: 600;}
	
	
	.c-textarea {overflow: hidden;position: relative;padding-bottom: 15px;color:#808080}
	.c-textarea-count { position: absolute;font-size: 12px;line-height: 16px; bottom: 5px; right:0px; color: #999;}
	.c-textarea  textarea {height: 80px; font-size: inherit; display: block;width: 100%;border: 0;box-sizing: border-box;outline: 0;resize: none;}
	.c-textarea:focus-within{border-color: #00a5e0;}	
	
	.disabled,.disabled .uni-input-placeholder,.disabled .disabledInp,.disabled .input-placeholder{color: #aaa;}
	// mode = 'switch'
	
	// mode = textarea
	.textarea-t{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.textarea-l{margin-bottom: 15px}
	// mode=img
	.img-l{display: flex;justify-content: space-between;margin-bottom: 15px;align-items: center;}
	.img-l .action{font-size: 12px; color: #999;}
	.subTitle{font-size: 12px;}
	
	
	
	// 借用 colorui
	.grid{
		display: flex;
		flex-wrap: wrap;
	}
	.flex-sub {
	    flex: 1;
	}
	.grid.grid-square > uni-view > uni-text[class*="cuIcon-"] {
	    font-size: 26px;
	    position: absolute;
	    color: #8799a3;
	    margin: auto;
	    top: 0;
	    bottom: 0;
	    left: 0;
	    right: 0;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    flex-direction: column;
		border: 1px solid #333;
	}
	.bg-img {
	    background-size: cover;
	    background-position: center;
	    background-repeat: no-repeat;
	}
	.grid.grid-square .cu-tag {
	    position: absolute;
	    right: 0;
	    top: 0;
	    border-bottom-left-radius: 3px;
	    padding: 3px 6px;
	    height: auto;
	    background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
	}
	.grid.grid-square>uni-view.bg-img uni-image {
	    width: 100%;
	    height: 100%;
	    position: absolute;
	}
	.cu-tag {
	    font-size: 12px;
	    vertical-align: middle;
	    position: relative;
	    display: inline-flex;
	    align-items: center;
	    justify-content: center;
	    box-sizing: border-box;
	    padding: 0px 8px;
	    height: 24px;
	    font-family: Helvetica Neue, Helvetica, sans-serif;
	    white-space: nowrap;
	}
	.solids::after {
	    border: 4px solid #eee;
	}
	.cuIcon-cameraadd:before {
	    content: "+";
	}
	.grid.col-4.grid-square>uni-view {
	    padding-bottom: calc((100% - 30px)/4);
	    height: 0;
	    width: calc((100% - 30px)/4);
	}
	.grid.col-4>uni-view {
	    width: 25%;
	}
	.grid.grid-square>uni-view {
	    margin-right: 10px;
	    margin-bottom: 10px;
	    border-radius: 3px;
	    position: relative;
	    overflow: hidden;
	}
	
	// 可删除
	.cuIcon-attentionforbidfill:before,
	.cuIcon-remind:before,
	.cuIcon-vipcard:before,
	.cuIcon-people:before,
	.cuIcon-attentionfill:before,
	.cuIcon-locationfill:before{
		content: "@"
	}
	.cuIcon-close:before{
		content: "×"
	}
	.cuIcon-right:before {
	   content: ">";
	   display: inline-block;
	   width: 30rpx;
	   background-repeat: no-repeat;
	   background-position: calc(100% - 32rpx) center;
	   background-image: url(../../static/add.png);
	}
	
</style>
