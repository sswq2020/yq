const store = {
    namespaced: true,
    state: {
        memberId:null, // 会员ID
    },
    mutations: {
        setMemberId(state,payload){
            state.memberId = payload
        }

    },
    actions: {

    }
}

export default store;