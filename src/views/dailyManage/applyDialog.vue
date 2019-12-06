<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="showClose"
    :center="true"
    width="575px"
    title="调价申请"
  >
    <el-form :model="applyFormParams" ref="applyForm" label-position="right" label-width="150px">
      <el-form-item label="油气名称" prop="oilModelName">{{applyFormParams.oilModelName}}</el-form-item>
      <el-form-item label="挂牌零售价" prop="oilRetailPrice" :rules="validatePrice(applyFormParams.oilChangeType,applyFormParams.oilMemberDiscount)">
        <el-input v-model="applyFormParams.oilRetailPrice" size="small"></el-input>
      </el-form-item>
      <el-form-item  v-if="applyFormParams.oilChangeType===Dict.ADJUST_BY_DISCOUNT"  label="会员折扣(%)" prop="oilMemberAgio">{{applyFormParams.oilMemberAgio}}</el-form-item>
      <el-form-item  v-if="applyFormParams.oilChangeType===Dict.ADJUST_BY_CHEAP"  label="会员优惠(元)" prop="oilMemberDiscount">{{applyFormParams.oilMemberDiscount}}</el-form-item>
      <el-form-item label="会员价" prop="oilMemberPrice">{{applyFormParams.oilMemberPrice}}</el-form-item>
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
import Dict from "util/dict.js";
import { number2 } from "util/validate.js";
import {ByDiscount,ByCheap } from "common/util.js";
const defaultApplyFormParams = {
  oilModelName: null, //油气品分类名称
  oilRetailPrice: null, // 零售价
  oilMemberAgio: null, // 会员折扣
  oilMemberDiscount:null, // 会员优惠
  oilMemberPrice: null, // 会员价
  effectTime: new Date(), // 生效时间
  oilChangeType: Dict.ADJUST_BY_DISCOUNT, // 调价方式,默认按折扣
  id: null
};

export default {
  name: "applyDialog",
  props: {
    data: {
      type: Object,
      default: function() {
        return Object.create(null);
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
      applyFormParams: { ...defaultApplyFormParams },
      Dict
    };
  },
  methods: {
    validateDate() {
      return [
        {
          required: true,
          message: "必填",
          trigger: "blur"
        },
        {
          validator(rule, value, callback) {
            const lastDay = new Date().setDate(new Date().getDate() - 1);
            if (value.valueOf() < lastDay) {
              callback(new Error(`不可选过去日`));
            }
            callback();
          }
        }
      ];
    },
    validatePrice(type,discount) {
      return [
        {
          required: true,
          message: "必填",
          trigger: "blur"
        },
        {
          pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{0,2})?$/,
          message: "最多保留2位小数"
        },
        {
          validator(rule, value, callback) {
            if(type === Dict.ADJUST_BY_CHEAP){
               if(Number(value) <= discount) {
                 callback(new Error(`挂牌价必须大于会员优惠`));
               }
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
        const {oilChangeType,oilMemberAgio,oilMemberDiscount} = this.applyFormParams
        let num = null
        if(!(newV && number2(newV))) {
            this.applyFormParams.oilMemberPrice = num;
            return
        }
        switch (oilChangeType){
          case Dict.ADJUST_BY_DISCOUNT:
            if(!oilMemberAgio) return
            num = ByDiscount(Number(newV),oilMemberAgio)
            this.applyFormParams.oilMemberPrice = num;
            break;
          case Dict.ADJUST_BY_CHEAP:
            if(!oilMemberDiscount || Number(newV) <= oilMemberDiscount) return
            num = ByCheap(Number(newV),oilMemberDiscount)
            this.applyFormParams.oilMemberPrice = num;
            break; 
          default:
            break;             
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
