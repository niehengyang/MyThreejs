/**
 *
 * 导入Vue 及 Vue Router
 *
 */
import Vue from 'vue';
import Cookies from 'js-cookie';

/** 引入vue-router**/
import baseVueRouter from 'vue-router';
Vue.use(baseVueRouter);

/** 引入three.js**/
import THREE from 'three.js';
Vue.use(THREE);

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */
window.$ = window.jQuery = require('jquery');


/**
 *
 * 导入ElementUI
 *
 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
});

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');
