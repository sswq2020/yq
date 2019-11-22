import Dict from "util/dict.js";

const defaultOilGasInfoFormParams = {
    /**油气品分类ID 新增的没有,编辑有*/
    id: null,
    /**油气类型id ,以后肯定要专门对其去重*/
    oilModelId:null,
    /**调价方式,默认为折扣比例*/
    oilChangeType: Dict.ADJUST_BY_DISCOUNT,
    /**油气型号名*/
    // oilModelName:null,
    /**零售价*/
    oilRetailPrice:null,
    /**会员价*/
    oilMemberPrice:null,
    /**会员折扣,调价方式为Dict.ADJUST_BY_DISCOUNT时,只有会员折扣*/
    oilMemberAgio:null,
    /**会员优惠,调价方式为Dict.ADJUST_BY_CHEAP时，只有会员优惠*/
    oilMemberDiscount:null,
    /**单位*/
    //oilUnit:null,
    gsId:null, // 加油站ID 新增的没有,编辑有,通过外部差值进来
}

const store = {
    namespaced:true,
    state:{
        oilgasinfodialogVisible: false, // 弹窗显示隐藏
        oilgasinfodialogEdit: false, // 默认新增
        oilgasinfoFormParams: { ...defaultOilGasInfoFormParams }, //表单里的参数
    },
    mutations:{
        setOilGasInfoDialogEdit(state, payload) {
            state.oilgasinfodialogEdit = payload;
        },
        setOilGasInfoFormParams(state, payload) {
            state.oilgasinfoFormParams = payload
        },
        setOilGasInfoDialogVisible(state, payload) {
            state.oilgasinfodialogVisible = payload
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
    actions:{
        // 打开新增弹窗
        openAddAgreeDialog({ commit }) {
            commit("overrideStateProps", { oilgasinfodialogEdit: false });
            commit("overrideStateProps", {
                oilgasinfoFormParams: {
                    ...defaultOilGasInfoFormParams
                },
            });
            commit("overrideStateProps", { oilgasinfodialogVisible: true });
        },
        clearAll({ commit }){
            commit("overrideStateProps", {
                oilgasinfoFormParams: {
                    ...defaultOilGasInfoFormParams
                },
            });
        },
        // 打开编辑弹窗
        openEditAgreeDialog({ commit }, payload) {
            // const {fileIdList,picUrlList,...params} = payload
            commit("overrideStateProps", { agreedialogEdit: true });
            commit("overrideStateProps", {
                oilgasinfoFormParams: payload
            });
            commit("overrideStateProps", { agreedialogVisible: true });
        },
        // 计算会员价
        computedOilMemberPrice({ commit }, payload){
            commit("updateStateProps", {
                name: "oilgasinfoFormParams",
                value: {
                    oilMemberPrice: payload
                }
            });
        }

    }

}

export default store;