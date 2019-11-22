import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import {memberForm,agreement,gasStationForm,oilGasInfo} from "./modules/vipManage";

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
    memberForm,
    agreement,
    gasStationForm,
    oilGasInfo
  }
});

export default store;
