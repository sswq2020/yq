import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import './assets/styles/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import VueCropper from 'vue-cropper'
import Hletong from 'hletong-ui'
import 'hletong-ui/lib/hletong-ui.css'
import './static/reset.css';
import './static/common.css';
import './static/new_common.css';
import {router} from './router';
import api from '@/api';
import store from "./store";


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(Hletong);
Vue.use(VueCropper);
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
