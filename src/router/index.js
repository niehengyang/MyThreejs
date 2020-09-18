
import Router from 'vue-router'
/**
 * 全局路由
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/home',
        name: 'home',
        component: () =>
            import('../components/BaseTest')
    },
    {
        path: "/first",
        name: 'first',
        component: () => import('../components/FirstPage')
    },
    {
        path: '/second',
        name: 'second',
        component: ()=> import('../components/SecondPage')
    },
    {
        path: '/three',
        name: 'three',
        component: ()=> import('../components/ThreePage')
    },
    {
        path: '/fore',
        name: 'fore',
        component: ()=> import('../components/ForePage')
    },
    {
        path: '/',
        name: 'ddapp',
        component: ()=> import('../ddapp/DDApp')
    }

];

export default new Router({
    mode: 'hash', /** 后端支持可开**/
    routes: constantRoutes
});
