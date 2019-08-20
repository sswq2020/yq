import Vue from 'vue'
import Router from 'vue-router'


// #region 商品管理
/**发布新商品*/
const ReleaseNewCommodity = () => import('views/commodityManage/releaseNewCommodity.vue')
/**编辑商品*/
const EditOldCommodity = () => import('views/commodityManage/editOldCommodity.vue')
/**出售中的商品*/
const CommodityOnSale = () => import('views/commodityManage/commodityOnSale.vue')
/**待售中的商品*/
const CommodityForSale = () => import('views/commodityManage/commodityForSale.vue')
/**订单管理*/
const OrderManage = () => import('views/commodityManage/orderManage.vue')
// #endregion

// #region 会员管理
/**卖家会员管理列表*/
const SellerVipManage = () => import('views/vipManage/sellerVipManage.vue')
/**买家会员管理列表*/
const BuyerVipManage = () => import('views/vipManage/buyerVipManage.vue')
/**新增或者编辑会员表单模块*/
const MemberForm = () => import('views/vipManage/memberForm.vue')
// #endregion

// #region 预警管理
/**协议到期预警*/
const DealDueforeWarn = () => import('views/foreWarnManage/dealDueforeWarn.vue')
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
        },
        // #region  商品管理      
        {
            path: '/web/hyw/product/product/deploy',
            name: 'releaseNewCommodity',
            component: ReleaseNewCommodity
        },
        {
            path: '/web/hyw/product/product/update',
            name: 'editOldCommodity',
            component: EditOldCommodity
        },           
        {
            path: '/web/hyw/product/product/pageOnSale',
            name: 'commodityOnSale',
            component: CommodityOnSale
        },
        {
            path: '/web/hyw/product/product/pageForSale',
            name: 'commodityForSale',
            component: CommodityForSale
        },
        {
            path: '/web/cm/commodity/orderManage/page',
            name: 'orderManage',
            component: OrderManage
        },
        // #endregion           

        // #region  会员管理  
        {
            path: '/web/hyw/member/member/pageSeller',
            name: 'sellerVipManage',
            component: SellerVipManage
        },
        {
            path: '/web/hyw/member/member/pageBuyer',
            name: 'buyerVipManage',
            component: BuyerVipManage
        },   
        {
            path: '/web/hyw/member/member/memberForm',
            name: 'memberForm',
            component: MemberForm
        },          
        // #endregion     


        // #region  预警管理      
        {
            path: '/web/hyw/member/agreement/page',
            name: 'dealDueforeWarn',
            component: DealDueforeWarn
        },
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
        next({name: 'test'})
    }
})
