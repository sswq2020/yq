import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

let globelRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index')
    }
]

let commonRoutes = {
	path:'/main',
	name:'main',
	component:() => import(/* webpackChunkName: "about" */ '@/views/main/main'),
	children:[
        {
            path: '/test',
            name: 'test',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/test/index'),
        },
        {
            path: '/personal',
            name: 'personal',
            component: () => import(/* webpackChunkName: "avatar" */ '@/views/personal/index'),
        }
    ]
}

export const router = new Router({
    routes: [
        ...globelRoutes,
        commonRoutes
    ]
})

//留取一份普通路由的name集合
let commonRoutesCluster = commonRoutes.children.map(target => target.name)
let globalRoutesCluster = globelRoutes.map(target => target.name)

router.beforeEach((to, from, next) => {
    if (commonRoutesCluster.includes(to.name) || globalRoutesCluster.includes(to.name)) {
        next()
    } else {
        next({name: 'test'})
    }
})
