const store = {
    namespaced: true,
    state: {
        gsId:null, // 加油站ID
        gsFormEdit:false // 默认新增加油站
    },
    mutations: {
        setGsId(state,payload){
            state.gsId = payload
        },
        setFormEdit(state,payload){
            state.gsFormEdit = payload
        },
    },
    actions: {

    }
}

export default store;