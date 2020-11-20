import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI);

import { checkRoles } from '@/common/utils';
Vue.prototype.$checkRoles = checkRoles;

Vue.config.productionTip = false;

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');
