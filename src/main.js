import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import './assets/styles/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import VueCropper from 'vue-cropper'
import './static/reset.css';
import './static/common.css';
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import {router} from './router';
import api from '@/api';
import store from "./store";
import hlet from 'hlet'
import hletComponents from 'hletComponents'
import VueAMap from 'vue-amap';


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(hlet);
Vue.use(hletComponents);
Vue.use(VueAMap);

Vue.use(VueCropper);
Vue.use(Viewer)
Vue.prototype.$api = api;


Vue.prototype.$messageError = content => Vue.prototype.$message({
  message: content,
  type: 'error',
  duration: 2000
});

Vue.prototype.$messageSuccess = content => Vue.prototype.$message({
  message: content,
  type: 'success',
  duration: 5000
});


//将app挂载到window上面，可以使用router的方法和一些弹窗效果。
window.VueApp = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
