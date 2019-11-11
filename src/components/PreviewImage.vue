<template>
  <el-dialog :visible.sync="dialogVisible" append-to-body :modal="false">
    <img width="100%" :src="dialogImageUrl" alt />
  </el-dialog>
</template>

<script>
export default {
  name: "PreviewImage",
  props: {
    dialogImageUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods:{
      open(){
          this.dialogVisible = true
      }
  }
};
</script>

<style>
</style>


