import * as type from './mutations-types';
import api from "api";
import Dict from "util/dict.js";
const store = {
    namespaced: true,
    state: {
        role:Dict.PLANT_USER, // 默认平台会员
        userId:null,
        username:null,
    },
    getters: {
      role: state => state.role,
      userId: state => state.userId,
      username: state => state.username,
      IS_OILVIP: state => state.role === Dict.OIL_VIP, // 判断是否是油站会员,默认平台会员
    },
    mutations: {
      [type.SET_ROLE](state,payload){
        state.role = payload
      },
      [type.SET_USER_ID](state,payload){
        state.userId = payload
      },
      [type.SET_USER_NAME](state,payload){
        state.username = payload
      },
    },
    actions: {
      // 获取数据字典项
      // async setYcData({ commit  }) {
      //   const dictionaryData = {
      //     YcProductType: 'SET_YC_PRODUCT_TYPE',
      //     YcDeliveryStoreType: 'SET_YC_DELIVERY_STORE'
      //   }; 
      //   const res = await api.getValidList({
      //     entryCodes: Object.keys(dictionaryData).join(),
      //     tenantId: 'hlyc'
      //   });
      //   switch (res.code) {
      //     case Dict.SUCCESS:
      //       res.data.forEach(data => {
      //         const listData = {};
      //         data.items.forEach(item => {
      //           listData[item.id] = item.text;
      //         });
      //         commit(dictionaryData[data.entryCode], listData);
      //       });
      //       break;
      //     default:
      //       break;
      //   }
      // },
    }
}

export default store;