<template>
  <el-dialog
    :close-on-click-modal="false"
    width="1000px"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    :title="title"
  >
  <slot></slot>
    <div slot="footer" class="dialog-footer">
      <PrintBtn :contentId="contentId"/>
      <el-button @click="cancle()">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import PrintBtn from './print.vue';
export default {
  name: "tickets",
  components: {
    PrintBtn
  },  
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    contentId:{
      type: String,
      required: true
    },
    cancelCb: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      showClose: false
    };
  },
  methods: {
    cancle() {
      this.cancelCb();
    }
  }
};
</script>