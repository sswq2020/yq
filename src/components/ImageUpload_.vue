<template>
  <div class="avatar-uploader">
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarFail"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    };
  },
  props: {
    maxSize: {
      type: Number,
      default() {
        return 3;
      }
    },
    onSuccess:{
      type: Function,
      default: ()=>{}       
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
      const status = file.status;
      switch (status) {
        case "uploading":
          break;
        case "success":
          this.onSuccess(file)
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
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 90px;
  height: 90px;;
  padding: 8px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar {
  width: 90px;
  height: 90px;
  display: block;
}
</style>

