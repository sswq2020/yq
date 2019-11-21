const defaultAgreeFormParams = {
    id: null, // 协议ID 新增的没有,编辑有
    contractCompanyId:null, //签约公司id
    agreementName: "加油站入会协议", // 协议名称
    effectTime: null, // 协议生效日期
    dueTime: null, // 协议到期日期
    fileIdList:[], // 图片的fileId数组
    picUrlList:[], // 图片的fileId数组对应的URL
    picLength: 0 // 图片数组长度
}


const store = {
    namespaced: true,
    state: {
        agreedialogVisible: false, // 弹窗显示隐藏
        agreedialogEdit: false, // 默认新增
        agreeFormParams: { ...defaultAgreeFormParams }, //表单里的参数
    },
    mutations: {
        setAgreeDialogEdit(state, payload) {
            state.agreedialogEdit = payload;
        },
        setAgreeFormParams(state, payload) {
            state.agreeFormParams = payload
        },
        setAgreeDialogVisible(state, payload) {
            state.agreedialogVisible = payload
        },
        overrideStateProps(state, payload) {
            Object.keys(payload).forEach(key => {
                state[key] = payload[key];
            });
        },
        updateStateProps(state, payload) {
            const { name, value } = payload;
            if (typeof state[name] === "object" && Array.isArray(state[name]) !== true) {
                state[name] = { ...state[name], ...value };
            } else {
                state[name] = value;
            }
        },
    },
    actions: {
        // 打开新增弹窗
        openAddAgreeDialog({ commit }) {
            commit("overrideStateProps", { agreedialogEdit: false });
            commit("overrideStateProps", {
                agreeFormParams: {
                    ...defaultAgreeFormParams
                },
            });
            commit("overrideStateProps", { agreedialogVisible: true });
        },
        clearAll({ commit }){
            commit("overrideStateProps", {
                agreeFormParams: {
                    ...defaultAgreeFormParams
                },
            });
        },

        // 打开编辑弹窗
        openEditAgreeDialog({ commit }, payload) {
            // const {fileIdList,picUrlList,...params} = payload
            commit("overrideStateProps", { agreedialogEdit: true });
            commit("overrideStateProps", {
                agreeFormParams: payload
            });
            commit("overrideStateProps", { agreedialogVisible: true });
        },
        // 删除某张图片
        detelePic({commit,state},index){
            const fileIdList = state.agreeFormParams.fileIdList.slice();
            const picUrlList = state.agreeFormParams.picUrlList.slice();
            fileIdList.splice(index,1);
            picUrlList.splice(index,1);
            commit("updateStateProps", {
                name: "agreeFormParams",
                value: {
                    fileIdList: fileIdList
                }
            });
            commit("updateStateProps", {
                name: "agreeFormParams",
                value: {
                    picUrlList: picUrlList
                }
            });
            commit("updateStateProps", {
                name: "agreeFormParams",
                value: {
                    picLength: picUrlList.length
                }
            });
        },
        // 尾部追加图片
       addPic({commit,state},payload){
           const {id,url} = payload
        const fileIdList = state.agreeFormParams.fileIdList.slice();
        const picUrlList = state.agreeFormParams.picUrlList.slice();
        fileIdList.push(id);
        picUrlList.push(url);
        commit("updateStateProps", {
            name: "agreeFormParams",
            value: {
                fileIdList: fileIdList
            }
        });
        commit("updateStateProps", {
            name: "agreeFormParams",
            value: {
                picUrlList: picUrlList
            }
        });
        commit("updateStateProps", {
            name: "agreeFormParams",
            value: {
                picLength: picUrlList.length
            }
        });
       }
    }
}

export default store;