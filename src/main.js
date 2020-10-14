import Vue from 'vue'
import App from './App.vue'

/** 第三方通用组件 **/
require('../src/bootstrap/3rd');

Vue.config.productionTip = false

import router from '../src/router/index';

/* api统一出口 */
import apis from '../src/apis/index';
Vue.prototype.$api = apis;

new Vue({ router, render: h => h(App) }).$mount('#app');
