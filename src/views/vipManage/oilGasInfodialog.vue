<template>
  <el-dialog :show-close="false" :title="title" :visible="oilgasinfodialogVisible" width="600px" append-to-body>
    <el-form :model="oilgasinfoFormParams" ref="oilgasinfoForm" label-position="right" label-width="150px">
      <el-form-item label="油气品分类" prop="oilModelId" :rules="[{ required: true, message: '必选' }]">
        <el-select style="width:100%" v-model="oilgasinfoFormParams.oilModelId" placeholder="请选择" size="small">
          <el-option
            v-for="(item,index) in OilModelList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="调价方式" prop="oilChangeType" :rules="[{ required: true, message: '必选'  }]">
        <el-select style="width:100%" v-model="oilgasinfoFormParams.oilChangeType" placeholder="请选择" size="small">
          <el-option
            v-for="(item,index) in AdjustPriceTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="挂牌零售价" prop="oilRetailPrice" :rules="validateRetailPrice(oilgasinfoFormParams.oilChangeType,oilgasinfoFormParams.oilMemberDiscount)">
        <el-input v-model="oilgasinfoFormParams.oilRetailPrice" size="small"></el-input>
      </el-form-item>

      <el-form-item label="会员折扣(%)" prop="oilMemberAgio" :rules="validateAgioPrice()" v-if="oilgasinfoFormParams.oilChangeType===Dict.ADJUST_BY_DISCOUNT">
         <el-input v-model="oilgasinfoFormParams.oilMemberAgio" size="small"></el-input>
      </el-form-item>

      <el-form-item label="会员优惠(元)" prop="oilMemberDiscount" :rules="validateDiscountPrice(oilgasinfoFormParams.oilRetailPrice)" v-if="oilgasinfoFormParams.oilChangeType===Dict.ADJUST_BY_CHEAP">
         <el-input v-model="oilgasinfoFormParams.oilMemberDiscount" size="small"></el-input>
      </el-form-item>

      <el-form-item label="会员价" prop="oilMemberPrice">{{oilgasinfoFormParams.oilMemberPrice}}</el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import {findLabelByValue,findIndexByValue} from "common/util";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util.js";
import { number2 } from "util/validate.js";
import NP from "number-precision";

const AdjustPriceTypeList = DICT_SELECT_ARR(Dict.ADJUST_PRICE_TYPE);
export default {
  name: "oilGasInfodialog",
  props: {
    loading:{
      type:Boolean,
      default:false
    },
    cancleCb: {
      type: Function,
      default: () => {}
    },
    confirmCb: {
      type: Function,
      default: () => {}
    },
    /**必须包含id,name,unit***/
    OilModelList:{
      type: Array,
      default: () => []       
    }
  },
  data() {
    return {
      /**调价方式数据源*/
      AdjustPriceTypeList,
      Dict
    };
  },
  computed: {
    ...mapState("oilGasInfo", [
      "oilgasinfoFormParams",
      "agreedialogEdit",
      "oilgasinfodialogVisible"
    ]),
    title() {
      return this.agreedialogEdit ? "编辑油气品分类" : "新增油气品分类";
    }
  },
  methods: {
    ...mapActions("oilGasInfo", ["clearAll","computedOilMemberPrice"]),
    /**零售价的校验*/
    validateRetailPrice(type,discount) {
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
               if(!discount){
                   callback();
                   return
               }
               if(Number(value) <= discount) {
                 callback(new Error(`挂牌价必须大于会员优惠`));
               }
            }
            callback();
          }
        }
      ];
    },
    /**折扣的校验*/
    validateAgioPrice() {
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
      ];
    },
    /**优惠价的校验*/   
    validateDiscountPrice(retailPrice) {
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
                if(!retailPrice){
                    callback();
                    return
                }
                if(Number(retailPrice) <= Number(value)) {
                 callback(new Error(`会员优惠必须小于挂牌价`));
               }
          }
        }
      ];
    },    
    cancle() {
      this.cancleCb();
    },
    /* @description 根据value找到oilUnit
    *  @returns {String}
    * */
    _findUnitByValue(arr,id){
        if (!Array.isArray(arr)) {
            return null
        }
        let copy = _.clone(arr);
        const index = findIndexByValue(copy,id);
        if (index > -1) {
        return copy[index].oilUnit;
        } else {
        return null;
        }
    },
    _filter() {
      const params = _.clone(
        Object.assign(
          {},
          this.oilgasinfoFormParams,
          {
            oilModelName: findLabelByValue(
              this.OilModelList,
              this.oilgasinfoFormParams.oilModelId
            ),
            oilUnit:this._findUnitByValue(
              this.OilModelList,
              this.oilgasinfoFormParams.oilModelId                
            )
          }
        )
      );
      return params;
    },
    confirm() {
      let that = this;
      this.$refs.oilgasinfoForm.validate(valid => {
        if (valid) {
          const params = that._filter()
          that.confirmCb(_.cloneDeep(params));
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    oilgasinfodialogVisible(newV) {
      if (newV === false) {
        this.clearAll();
        setTimeout(() => {
          this.$refs.oilgasinfoForm.clearValidate();
        }, 50);
      }
    },
    "oilgasinfoFormParams.oilRetailPrice": {
      handler(newV) {
        //零售价存在才可计算
        if (newV && number2(newV)) {
          //按折扣  
          if (this.oilgasinfoFormParams.oilChangeType === this.Dict.ADJUST_BY_DISCOUNT) {
            if(!this.oilgasinfoFormParams.oilMemberAgio) return;
            let num1 = NP.times(Number(newV),this.oilgasinfoFormParams.oilMemberAgio,100);
            let num2 = NP.divide(num1, 100, 100);
            let num3 = NP.round(num2, 2);
            this.computedOilMemberPrice(num3);
          } else {
            //按优惠    
            if(!this.oilgasinfoFormParams.oilMemberDiscount){
              return
            }
            if (Number(newV) <= this.oilgasinfoFormParams.oilMemberDiscount) {
              return;
            } else {
              let num1 = NP.minus(Number(newV),this.oilgasinfoFormParams.oilMemberDiscount);
              let num2= NP.round(num1, 2);
              this.computedOilMemberPrice(num2);
            }
          }
        }
      }
    },
    "oilgasinfoFormParams.oilMemberDiscount": {
      handler(newV) {
        //按优惠存在才可计算
        if (newV && number2(newV)) { 
            /**零售价*/ 
            const oilRetailPrice = this.oilgasinfoFormParams.oilRetailPrice
            if(!oilRetailPrice){
                return
            }
            if (Number(newV) >= Number(oilRetailPrice)) {
              return;
            } else {
              let num1 = NP.minus(oilRetailPrice,Number(newV));
              let num2= NP.round(num1, 2);
              this.computedOilMemberPrice(num2);
            }
        }        
      }
    },
    "oilgasinfoFormParams.oilMemberAgio":{
      handler(newV) {
        //折扣 存在才可计算
        if (newV && number2(newV)) {
            const oilRetailPrice = this.oilgasinfoFormParams.oilRetailPrice
            if(!oilRetailPrice){
                return
            }
            let num1 = NP.times(Number(newV),oilRetailPrice,100);
            let num2 = NP.divide(num1, 100, 100);
            let num3 = NP.round(num2, 2);
            this.computedOilMemberPrice(num3);
        }
      }        
    }
  }
};
</script>
<style scoped lang="less">
</style>
