<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    width="575px"
    title="油气品分类"
  >
    <el-form :model="form" ref="form" label-position="right" label-width="150px">
      <el-form-item
        label="油气品单位"
        prop="oilUnit"
        :rules="[{ required: true, message: '必填', trigger: 'blur' }]"
      >
        <el-select style="width:100%" v-model="form.oilUnit" placeholder="请选择" size="small">
            <el-option
                v-for="(item,index) in ModelUnitList"
                :key="index"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
      </el-form-item>     
      <el-form-item
        label="油气品分类名称"
        prop="oilModelName"
        :rules="[
            { required: true, message: '必填', trigger: 'blur' },
            { max: 10, message: '最长10个之内', trigger: 'blur' }
          ]"
      >
        <el-input placeholder="请输入" v-model="form.oilModelName" size="small"></el-input>
      </el-form-item>

      <el-form-item
        label="油气品分类描述"
        prop="oilModelDesc"
        :rules="[{ max: 500, message: '最长500个之内', trigger: 'blur' }]"
      >
        <el-input placeholder="请输入" type="textarea" v-model="form.oilModelDesc" size="small"></el-input>
      </el-form-item>

    <el-form-item label="是否默认展示" prop="isDefault">
        <el-radio-group v-model="form.isDefault">
              <el-radio
                v-for="item in ModelDefaultList"
                :key="item.value"
                :label="item.value"
              >{{item.label}}</el-radio>
        </el-radio-group>
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
import { DICT_SELECT_ARR } from "common/util";
const ModelUnitList = DICT_SELECT_ARR(Dict.MODEL_UNIT_TYPE);
const ModelDefaultList = DICT_SELECT_ARR(Dict.MODEL_TOGGLE_DEFAULT);

const defaultApplyFormParams = {
  /**油气品单位*/
  oilUnit: null,
  /**油气品分类名称*/
  oilModelName: null,
  /**油气品分类描述*/
  oilModelDesc: null,
  /**是否默认展示*/
  isDefault:Dict.MODEL_IS_DEFAULT,
  id: null
};

export default {
  name: "oilGasSortDialog",
  components: {
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
      ModelUnitList,
      ModelDefaultList,
      maxSize: 10
    };
  },
  methods: {
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
          this.$refs.form.clearValidate();
          this.form = { ...defaultApplyFormParams };
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
