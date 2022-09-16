import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import ElementUI from 'element-ui'
Vue.use(ElementUI)

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/reset.css'
import '@/assets/styles/global.scss'
import '@/assets/icons/index.css'
import '@/assets/icons/iconfont.css'

Vue.config.productionTip = false



// import './mock'  
// import './mount'

const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
