import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import {releaseNewCommodity,commodityOnSale,commodityForSale} from "./modules/commodityManage";
import {memberForm,agreement} from "./modules/vipManage";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {

  },
  getters: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    app,
    releaseNewCommodity,commodityOnSale,commodityForSale,
    memberForm,agreement
  }
});

export default store;
