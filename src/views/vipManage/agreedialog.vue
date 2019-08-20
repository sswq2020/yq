<template>
  <el-dialog :show-close="false" :title="title" :visible="agreedialogVisible" width="600px">
    <el-form :model="agreeFormParams" ref="agreeForm" label-position="right" label-width="150px">
      <el-form-item label="协议名称" prop="agreementName" :rules="[{ required: true, message: '必选'  }]">
        <el-input v-model="agreeFormParams.agreementName"></el-input>
      </el-form-item>
      <el-form-item
        label="协议类型"
        prop="agreementTypeCode"
        :rules="[{ required: true, message: '必填'  }]"
      >
        <el-select style="width:100%" v-model="agreeFormParams.agreementTypeCode">
          <el-option
            v-for="item in agreementTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协议生效日期" prop="effectTime" :rules="[{ required: true, message: '必选'  }]">
        <el-date-picker
          v-model="agreeFormParams.effectTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="协议到期日期"
        prop="dueTime"
        :rules="validDueTime(agreeFormParams.effectTime,checked)"
      >
        <el-date-picker
          v-model="agreeFormParams.dueTime"
          :disabled="dueTimeDisabled"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="长期">
        <el-checkbox v-model="checked"></el-checkbox>
      </el-form-item>
      <el-form-item 
        label="协议图片" 
        prop="picLength"
        :rules="validPic()"
        >
        <div class="imgBox" :key="index" v-for="(url,index) in agreeFormParams.picUrlList">
          <ImageBox :url="url" :onDelete="()=>{uploadDelete(index)}"></ImageBox>
        </div>
        <div class="imgBox">
          <ImageUpload :onSuccess="(file)=>{this.uploadSuceess(file)}"></ImageUpload>
        </div>
        <el-input type="hidden" :value="agreeFormParams.picLength"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations,mapActions } from "vuex";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util.js";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload";
const AgreementTypeList = DICT_SELECT_ARR(Dict.AGREE_TYPE);
export default {
  name: "agreedialog",
  props: {
    cancleCb: {
      type: Function,
      default: () => {}
    },
    confirmCb: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    ImageBox,
    ImageUpload
  },  
  data() {
    return {
      agreementTypeList: AgreementTypeList,
      /**长期勾选,则可以不选到期时间*/
      checked: false,
      /**到期时间不可编辑,默认可编辑*/
      dueTimeDisabled: false
    };
  },
  computed: {
    ...mapState("agreement", [
      "agreeFormParams",
      "agreedialogEdit",
      "agreedialogVisible",
    ]),
    title() {
      return this.agreedialogEdit ? "编辑入会协议" : "新增入会协议";
    }
  },
  methods: {
    ...mapMutations("agreement", [
      "setAgreeDialogEdit",
      "setAgreeFormParams",
      "setAgreeDialogVisible"
    ]),
    ...mapActions("agreement",[
      "detelePic",
      "addPic",
      "clearAll"
    ]),
    cancle() {
      this.cancleCb();
    },
    confirm() {
      let that = this;
      this.$refs.agreeForm.validate(valid => {
        if (valid) {
          that.confirmCb(_.cloneDeep(this.agreeFormParams));
        } else {
          return false;
        }
      });
    },
    validDueTime(effectTime, checked) {
      if (!checked) {
        return [
          {
            required: true,
            message: "长期不勾选则必填"
          },
          {
            validator(rule, value, callback) {
              if (!effectTime) {
                callback(new Error("请先选择生效时间"));
              } else {
                const startTime = new Date(effectTime);
                const endTime = new Date(value);
                if (startTime >= endTime) {
                  callback(new Error("生效时间必须小于到期时间"));
                }
              }
              callback();
            }
          }
        ];
      } else {
        return [
          {
            validator(rule, value, callback) {
              callback();
            }
          }
        ];
      }
    },
    validPic(){
        return [
          {
            required: true,
            message: "必上传"
          },
          {
            validator(rule, value, callback) {
              if (value === 0) {
                callback(new Error("至少上传一张"));
              }
              callback();
            }
          }
        ];
    },
    uploadDelete(index){
      this.detelePic(index)
    },
    uploadSuceess(res){
      this.addPic(res.data)
    }
  },
  watch: {
    agreedialogVisible(newV) {
      if (newV === false) {
        this.checked = false;
        this.clearAll()
        setTimeout(()=>{
            this.$refs.agreeForm.clearValidate();
        },50)
      } else {
        if(this.agreedialogEdit && !this.agreeFormParams.dueTime){
          this.checked = true
        }
      }
    },
    checked(newV) {
      if (newV) {
        this.dueTimeDisabled = true;
        this.agreeFormParams.dueTime = null;
      } else {
        this.dueTimeDisabled = false;
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
