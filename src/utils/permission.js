import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import router from '../router/index';
import store from '../store/index';

import { Message } from 'element-ui';
Vue.use(Vuex, VueRouter, router, store, Message);

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import TokenFactory from './tokenfactory'; // get token from cookie

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/401', '/404']; // 不重定向白名单

router.beforeEach((to, from, next) => {
    NProgress.start();
    if (TokenFactory.getToken()) {

        /** has token**/
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done();
        } else {
            // console.log('____________初次登录_____________');

            if (store.getters.permission_routers.length === 0) {
                // console.log('____________用户信息_____________');
                store.dispatch('GetInfo').then(res => { // 拉取用户信息

                    // console.log('____________用户权限_____________');
                    store.dispatch('generateRoutes').then((res) => { // 拉取路由表

                        router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表

                        // console.log('____________用户菜单_____________');
                        store.dispatch('GetMenuTree').then((res) => { // 拉取菜单
                            next({ ...to, replace: true });
                        });
                    });
                }).catch((err) => {

                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err || 'Verification failed, please login again');
                        next({ path: '/' });
                    });
                });
            } else {
                // console.log('*************正常路由************');
                if (to.name) {
                    next();
                } else {
                    next({ path: '/404', replace: true, query: { noGoBack: true }});
                }

            }

        }
    } else {
        /** has no token**/
        // console.log('*************未登录白名单校验************');
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login');
            NProgress.done();
        }
    }
});


router.afterEach(() => {
    NProgress.done(); // 结束Progress

});
