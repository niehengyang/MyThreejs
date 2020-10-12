/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 项目域名地址
 *
 */

let baseUrl = '';
const env = process.env;
if (env.NODE_ENV === 'development') {
    baseUrl = `/api`;// 开发环境地址
} else if (env.VUE_APP_CURRENTMODE === 'production') {
    baseUrl = `http://39.100.122.207:8901/`;// 生产环境地址
} else if (env.VUE_APP_CURRENTMODE === 'test') {
    baseUrl = `http://127.0.0.1:9501/`;// 测试环境地址
}

module.exports = {
    baseUrl,
    env
};
