<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    append-to-body
    width="575px"
    title="特色服务"
  >
    <el-form :model="form" ref="form" label-position="right" label-width="150px">
      <el-form-item
        label="特色服务名称"
        prop="fsName"
        :rules="[
            { required: true, message: '必填', trigger: 'blur' },
            { max: 10, message: '最长10个之内', trigger: 'blur' }
          ]"
      >
        <el-input placeholder="请输入特色服务名称" v-model="form.fsName" size="small"></el-input>
      </el-form-item>

      <el-form-item
        label="特色服务ICON"
        prop="fsIcon"
        :rules="[{ required: true, message: '未上传,请上传特色服务Icon',trigger: 'blur' }]"
      >
        <div class="imgBox"  v-show="form.fsIcon">
          <ImageBox :url="form.fsIconUrl" :onDelete="uploadDelete"></ImageBox>
        </div>
        <div class="imgBox" v-show="!(form.fsIcon)">
          <ImageUpload :maxSize="maxSize" :onSuccess="(file)=>{this.uploadSuceess(file)}"></ImageUpload>
        </div>
        <el-input type="hidden" :value="form.fsIcon" style="display:inline;height:0"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import _ from "lodash";
import Dict from "util/dict.js";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload";
const defaultApplyFormParams = {
  /**油气品分类名称*/
  fsName: null,
  /**图片fileId */

  fsIcon: null,
  /**图片url*/

  fsIconUrl: "#",
  id: null
};

export default {
  name: "featureDialog",
  components: {
    ImageBox,
    ImageUpload
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return Object.create(null);
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    confirmCb: {
      type: Function,
      default: () => {}
    },
    cancelCb: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      showClose: false,
      form: { ...defaultApplyFormParams },
      Dict,
      maxSize: 10
    };
  },
  methods: {
    uploadDelete() {
      this.form.fsIconUrl = "#";
      this.form.fsIcon = null;
    },
    uploadSuceess(res) {
      this.form.fsIconUrl = res.data.url;
      this.form.fsIcon = res.data.id;
    },
    async _getFilesInfo(fileId) {
      const res = await this.$api.getFilesInfo({ fileId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.form.fsIconUrl = res.data.url;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    cancle() {
      this.cancelCb();
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmCb(this.form);
        }
      });
    }
  },
  watch: {
    visible: {
      handler(newV) {
        if (newV) {
          if (this.isEdit) {
            this.form = JSON.parse(JSON.stringify(this.data));
          }
        } else {
          this.form = { ...defaultApplyFormParams };
          this.$refs.form.clearValidate();
        }
      }
    },
    "form.fsIcon": {
      handler(newV, oldV) {
        if (newV) {
          if (newV !== oldV && this.form.fsIconUrl === "#") {
            this._getFilesInfo(newV);
          }
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
