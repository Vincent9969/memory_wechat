import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

Vue.prototype.websiteUrl = 'http://192.168.1.3:8089'; 

Vue.prototype.getImgUrl = 'http://192.168.1.3:8089/showImage/'; 

Vue.prototype.$serverUrl = 'https://unidemo.dcloud.net.cn';
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
