<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Dict from "util/dict.js";
export default {
  name: "app",
  computed: {
    ...mapState("app",["role", "userId", "username"])    
  },
  methods: {
    ...mapMutations("app",["SET_ROLE","SET_USER_ID","SET_USER_NAME"]),
    async getInfo() {
      const res = await this.$api.getUser();
      if (res.code === Dict.SUCCESS) {
        const userId = res.data.userId;
        const username = res.data.username;
        const role = res.data.userType;
        this.SET_USER_ID(userId);
        this.SET_USER_NAME(username);
        this.SET_ROLE(role);
      }
    }
  },
  created() {
    this.getInfo()
  }
};
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  background-color: #252a2f;
  width: 100%;
  height: 100%;
  font-size: 14px;
  .config-message {
    margin-top: 100px;
  }
  #app {
    font-family:'Microsoft YaHei, Arial';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #000;
    padding: 0;
    margin: 0;
    width:100%;
    height:100%;
    overflow-x: hidden;
    .single-page{
      display: block;
      background-color: white;
      /*padding:0 20px;*/
    }
  }
}
</style>
