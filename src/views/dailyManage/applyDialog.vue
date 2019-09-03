<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    width="600px"
    title="调价申请"
  >
    <el-form :model="applyFormParams" ref="applyForm" label-position="right" label-width="150px">
      <el-form-item label="油气名称" prop="oilModelName">
        <el-input :value="applyFormParams.oilModelName" readonly size="small"></el-input>
      </el-form-item>
      <el-form-item
        label="挂牌零售价"
        prop="oilRetailPrice"
        :rules="[
      { required: true, message: '必选'},
      { pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{0,2})?$/,message: '最多保留2位小数'}
      ]"
      >
        <el-input v-model="applyFormParams.oilRetailPrice" size="small"></el-input>
      </el-form-item>
      <el-form-item label="会员折扣" prop="oilMemberAgio">
        <el-input :value="applyFormParams.oilMemberAgio" readonly size="small"></el-input>
      </el-form-item>
      <el-form-item label="会员价" prop="oilMemberPrice">
        <el-input :value="applyFormParams.oilMemberPrice" readonly size="small"></el-input>
      </el-form-item>

      <el-form-item label="生效日期" prop="effectTime" :rules="validateDate()">
        <el-date-picker
          size="small"
          v-model="applyFormParams.effectTime"
          type="datetime"
          placeholder="选择日期"
          format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
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
import {number2} from 'util/validate.js'
import NP from 'number-precision'
const defaultApplyFormParams = {
  oilModelName: null,
  oilRetailPrice: null,
  oilMemberAgio: null,
  oilMemberPrice: null,
  effectTime: null,
  oilChangeType:null,
  id: null
};

export default {
  name: "applyDialog",
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      }
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
      applyFormParams: { ...defaultApplyFormParams }
    };
  },
  methods: {
    validateDate(){
      return [
        {
          required: true,
          message: "必填",
          trigger: "blur"
        },
        {
          validator(rule, value, callback) {
            const lastDay = new Date().setDate(new Date().getDate() - 1 )            
            if(value.valueOf() < lastDay) {
              callback(new Error(`不可选过去日`));
            }
            callback();
          }
        }
      ];      
    },
    cancle() {
      this.cancelCb();
    },
    confirm() {
      this.$refs.applyForm.validate(valid => {
        if (valid) {
          this.confirmCb(this.applyFormParams);
        } 
      });      

    }
  },
  watch: {
    visible: {
      handler(newV) {
        if (newV) {
          this.applyFormParams = JSON.parse(JSON.stringify(this.data));
        } else {
          this.$refs.applyForm.clearValidate();
          this.applyFormParams = { ...defaultApplyFormParams };          
        }
      }
    },
    "applyFormParams.oilRetailPrice": {
      handler(newV) {
        if(newV && number2(newV)) {
           let num1 = NP.times(Number(newV),this.applyFormParams.oilMemberAgio,100);
           let num2 = NP.divide(num1,100,100);
           let num3 = NP.round(num2,2)
           this.applyFormParams.oilMemberPrice = num3
        }else {
            this.applyFormParams.oilMemberPrice = 0
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
