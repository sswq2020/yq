const defaultParams = {
    price: null, // 售价
    totalNumInventory: null, // 库存
}

const store = {
    namespaced: true,
    state: {
        formParams:{
            ...defaultParams
        },
        pricedialog:false
    },
    mutations: {
        setPricedialog(state, payload) {
            state.pricedialog = payload
        },
        setFormParams(state,payload){
            state.formParams = payload
        }
    },
    actions: {
        // 打开弹窗
        openPriceDialog({ commit }, payload) {
            commit('setFormParams', payload)
            commit('setPricedialog',true)
        }
    }
}

export default store;