const store = {
    namespaced: true,
    state: {
        isEdit:false,   // 默认都是新增商品的页面
        commodityId:null // 编辑的默认商品
    },
    mutations: {
        setIsEdit(state,payload) {
            state.isEdit = payload;
        },
        setCommodityId(state,payload){
            state.commodityId = payload
        }

    },
    actions: {

    }
}

export default store;