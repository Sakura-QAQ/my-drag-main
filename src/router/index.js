import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const routes = [{
        path: '/',
        name: 'dragReport',
        component: () => import("../views/index.vue")
    },{
        path:"/configPage",
        name:"CreateConfigPage",
        component: () => import("../components/configPage/CreateConfigPage.vue")
    }
]

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})