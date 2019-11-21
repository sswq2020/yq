<template>
  <el-dialog :visible="visible" :fullscreen="true" class="tab-dialog"  @close="cancel()">
    <el-tabs tab-position="left" class="tabs">
      <slot></slot>
<!--       <el-tab-pane label="实名信息">
        <PersonalRealName />
      </el-tab-pane>
      <el-tab-pane label="实名信息">
        <CompanyRealName />
      </el-tab-pane>
      <el-tab-pane label="银行账户信息">
        <BankCardList />
      </el-tab-pane>
      <el-tab-pane label="开票信息">角色管理</el-tab-pane> -->


    </el-tabs>
</el-dialog>
</template>

<script>
// import PersonalRealName from './personalRealName';
// import CompanyRealName from './companyRealName';
// import BankCardList from './bankCardList';
// import editMemberForm from '../editMemberForm.vue'
// import permission from '../permission.vue'
export default {
  name: 'userDialog',
  components: {
    // PersonalRealName,
    // CompanyRealName,
    // BankCardList
    // editMemberForm,
    // permission
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    cancel() {
      this.$emit('updateVisible', false);
    }
  }
}
</script>

<style lang="less" scoped>
.tab-dialog /deep/  .el-dialog.is-fullscreen {
  min-height: 100%;
}
.tab-dialog /deep/ .el-dialog__header {
  height: 0;
  border-bottom: 0;
}
.tab-dialog /deep/ .el-tab-pane {
  background: #f6f8fa;
}
.tab-dialog /deep/ .el-dialog__body {
  padding: 0;
  min-height: 100vh;
}
.tab-dialog /deep/ .el-tabs--left {
  height: 100%;
  
}
.tab-dialog /deep/ .el-tabs__header.is-left {
  background: #ddd;
  margin-right: 0;
}
.tabs /deep/ .el-tab-pane {
  height: 100vh;
  overflow: auto;
}
</style>