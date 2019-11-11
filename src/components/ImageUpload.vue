<template>
  <div class="avatar-ss-uploader" :class="computedClassId">
    <el-upload
      :action="actionUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarFail"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus avatar-ss-uploader-icon" :class="computedClassIcon"></i>
    </el-upload>
  </div>
</template>

<script>
import { hostList } from "api/mock";
import ENV from "common/env";
import DICT from "util/dict";
export default {
  name: "ImageUpload",
  data() {
    return {
      fileList: [],
      actionUrl: `${hostList[ENV]}/dfs/open/files/upload`
    };
  },
  props: {
    maxSize: {
      type: Number,
      default() {
        return 3;
      }
    },
    onSuccess: {
      type: Function,
      default: () => {}
    },
    front: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedClassId() {
      if (this.front || this.back) {
        return "idcard";
      }else{
        return ''
      }
    },
    computedClassIcon(){
      if(this.front) {
        return 'front'
      }
      if(this.back) {
        return 'back'
      }
      return ''
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const maxSize = this.maxSize;
      if (file.type.indexOf("image") === -1) {
        this.$messageError("请上传图片文件！");
        return false;
      }
      if (file.size / 1024 / 1024 > maxSize) {
        this.$messageError(`图片请在${maxSize}MB以下！`);
        return false;
      }
      return true;
    },
    handleAvatarSuccess(res, file, fileList) {
      console.log(file, fileList);
      const Code = res.code;
      switch (Code) {
        case DICT.SUCCESS:
          this.onSuccess(res);
          this.$messageSuccess("图片上传成功！");
          break;
        default:
          break;
      }
    },
    handleAvatarFail(err, file, fileList) {
      this.$messageError("图片上传失败，请稍后重试！");
    }
  }
};
</script>

<style scoped lang="less">
.avatar-ss-uploader{
  box-sizing: border-box;
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 90px;
  height: 90px;
  padding: 8px;
  &:hover{
    border-color: #409eff;
  }
  &.idcard {
    padding: 0px;
    border: 0px;
  }
}
.avatar-ss-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 74px;
  height: 74px;
  line-height: 74px;
  text-align: center;
  &.front {
    width: 90px;
    height: 90px;
    line-height: 90px;
    background: #fff url("../assets/front.png") no-repeat;
  }
  &.back {
    width: 90px;
    height: 90px;
    line-height: 90px;
    background: #fff url("../assets/back.png") no-repeat;
  }
}
</style>

