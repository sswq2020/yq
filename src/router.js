import Vue from 'vue'
import Router from 'vue-router'

// #region 日常管理
/**加注明细*/
const GasInfoList = () => import('views/dailyManage/gasInfoList.vue')
/**调价历史*/
const AdjustHistory = () => import('views/dailyManage/adjustHistory.vue')
/**调价申请*/
const AdjustApply = () => import('views/dailyManage/adjustApply.vue')
// #endregion

// #region 财务管理
/**开票信息、寄票地址信息*/
const BillWithPost = () => import('views/financeManage/billWithPost.vue')
/**票据对账列表*/
const BillCheck = () => import('views/financeManage/billCheck.vue')
// #endregion


// #region 基础信息
/**特色服务管理*/
const Feature = () => import('views/basicManage/feature.vue')
// #endregion

Vue.use(Router)

let globelRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index')
    }
]

let commonRoutes = {
    path: '/main',
    name: 'main',
    component: () => import(/* webpackChunkName: "about" */ '@/views/main/main'),
    children: [
        {
            path: '/test',
            name: 'test',
            component: () => import(/* webpackChunkName: "demo" */ '@/views/test/index'),
        },
        {
            path: '/personal',
            name: 'personal',
            component: () => import(/* webpackChunkName: "avatar" */ '@/views/personal/index'),
        },
        // #region  日常管理    
        {
            path: '/web/pageTaggingQuery',
            name: 'plantGasInfoList',
            component: GasInfoList
        },
        {
            path: '/web/pageTaggingHasRoleQuery',
            name: 'oilVIPGasInfoList',
            component: GasInfoList
        },
        {
            path: '/web/base/oilHistory/page',
            name: 'plantAdjustHistory',
            component: AdjustHistory
        },
        {
            path: '/web/base/oilsPrice/page',
            name: 'oilVIPAdjustApply',
            component: AdjustApply
        },
        // #endregion           

        // #region  基础管理    
        {
            path: '/web/base/feature/page',
            name: 'feature',
            component: Feature
        },
        // #endregion  


        // #region  财务管理    
        {
            path: '/web/base/invoiceAddress/getInvoiceAddress',
            name: 'billWithPost',
            component: BillWithPost
        },
        {
            path: '/web/base/receiptBill/getBillCheckList',
            name: 'billCheck',
            component: BillCheck
        }
        // #endregion     


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
        next({ name: 'test' })
    }
})
