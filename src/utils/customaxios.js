/**
 *
 * 定制Axios
 * 统一的错误错误
 * 相应数据格式统一处理
 * 统一的token头添加
 *
 */
import Vue from 'vue';
import axios from 'axios';
import TokenFactory from './tokenfactory';

import { baseUrl } from '../../src/config/env';
// 创建axios实例
const service = axios.create({
    baseURL: baseUrl, // api的base_url
    timeout: 5000 // 请求超时时间
});

/** 错误时的提示信息**/
const errorTip = msg => {
    Vue.prototype.$message.error(msg);
};

/** 成功时的提示信息**/
// const successTip = msg => {
//     Vue.prototype.$message.success(msg);
// };

/** 跳转到登录页**/
const toLogin = () => {
    /** token校验失败后 ，清除token**/
    Vue.prototype.$message({
        type: 'error',
        message: '登录超时，请重新登录。3秒后将跳回登录页',
        onClose: () => {
            TokenFactory.clearToken();
            window.location.href = '/login';
        }
    });
};

/** 跳转到404页面**/
const to404Page = () => {
    window.location.href = '/404';
};

/** 请求失败的错误统一处理**/
const errorHandler = (status, msg) => {
    switch (status) {
        case 304: errorTip('请求无更改(304)'); break;
        case 400: errorTip(msg ? msg : '参数验证错误(400)'); break;
        case 40101: toLogin(); break;
        case 40102: errorTip(msg ? msg : '用户名或密码错误'); break;
        case 403: errorTip(msg ? msg : '无权限操作(403)'); break;
        case 404: to404Page(); break;
        case 408: errorTip('请求超时'); break;
        case 500: errorTip(msg ? msg : '服务器错误(500)'); break;
        case 501: errorTip('服务未实现(501)'); break;
        case 502: errorTip('网络错误(502)'); break;
        case 503: errorTip('服务不可用(503)'); break;
        case 504: errorTip('网络超时(504)'); break;
        case 505: errorTip('HTTP版本不受支持(505)'); break;

        default:
            errorTip(msg ? msg : `连接出错(${status})!`);
    }
};

/** 请求拦截器**/
service.interceptors.request.use(
    config => {
        if (1) { /** 判断token是否存在**/
            config.headers = {
                'Authorization': TokenFactory.getToken(),
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            };
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

/** 响应拦截器**/
service.interceptors.response.use(res => {
    return res.data;

}, error => {

    if (error.response.status === 401) {
        errorHandler(error.response.data.code, error.response.data.message);
    } else if (error.response) {
        errorHandler(error.response.status, error.response.data.message);
    }

    /** 请求超时**/
    if (error.response.data.message.includes('timeout')) {   // 判断请求异常信息中是否含有超时timeout字符串
        errorHandler(408, error.response.data.message);
    }
    return Promise.reject(error);
});


export default service;
