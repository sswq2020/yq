<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    :title="title"
  >
    <slot name="tip"></slot>
    <el-table stylestripe border :data="data">
      <el-table-column
        show-overflow-tooltip
        align="center"
        :prop="item.prop"
        :label="item.label"
        :key="index"
        v-for="(item,index) in tableHeader"
      >
        <template slot-scope="scope">
          <span>{{data[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <slot name="count"></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "transitiondialog",
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tableHeader: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    },
    loading:{
      type: Boolean,
      default: false      
    },
    visible:{
      type: Boolean,
      default: false      
    },
    confirmCb:{
      type: Function,
      default: ()=>{}      
    },
    cancelCb:{
      type: Function,
      default: ()=>{}     
    }
  },
  data() {
    return {
      showClose:false
    };
  },
  methods: {
    cancle() {
      this.cancelCb();
    },
    confirm() {
      this.confirmCb()
    }
  }
};
</script>
<style scoped lang="less">
</style>
