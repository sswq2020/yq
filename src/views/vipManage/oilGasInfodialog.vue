<template>
  <el-dialog :show-close="false" :title="title" :visible="oilgasinfodialogVisible" width="575px" append-to-body>
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
      
      <el-form-item label="会员折扣(%)" prop="oilMemberAgio" :rules="[{pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{0,2})?$/,message: '只能输入数字,最多保留2位小数'}]" v-if="showDiscount">
         <el-input v-model="oilgasinfoFormParams.oilMemberAgio" size="small"></el-input>
      </el-form-item>

      <el-form-item label="会员优惠(元)" prop="oilMemberDiscount" :rules="validateDiscountPrice(oilgasinfoFormParams.oilRetailPrice)" v-if="!showDiscount">
         <el-input v-model="oilgasinfoFormParams.oilMemberDiscount" size="small"></el-input>
      </el-form-item>

      <el-form-item label="会员价">{{oilgasinfoFormParams.oilMemberPrice}}</el-form-item>

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
import { DICT_SELECT_ARR,deepMerge,ByDiscount,ByCheap } from "common/util.js";
import { number2 } from "util/validate.js";

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
      "oilgasinfodialogEdit",
      "oilgasinfodialogVisible"
    ]),
    title() {
      return this.oilgasinfodialogEdit ? "编辑油气品分类" : "新增油气品分类";
    },
    showDiscount(){
      return this.oilgasinfoFormParams.oilChangeType === Dict.ADJUST_BY_DISCOUNT;
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
          message: "只能输入数字,最多保留2位小数"
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
          message: "只能输入数字,最多保留2位小数"
        },
        {
          validator(rule, value, callback) {
                if(!retailPrice){
                  callback();
                }
                if(Number(retailPrice) <= Number(value)) {
                 callback(new Error(`会员优惠必须小于挂牌价`));
               }
               callback()
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
      this.$refs.oilgasinfoForm.validate((valid) => {
        if (valid) {
          const params = that._filter()
          that.confirmCb(deepMerge(params));
        } else {
          return false;
        }
      });
    },
    /* @description 按折扣的算法
    *  @returns {number}
    * */
  },
  watch: {
    "oilgasinfodialogVisible":{
     handler(newV){
       let that = this;
      if (newV === false) {
        this.clearAll();
        setTimeout(() => {
          that.$refs.oilgasinfoForm.clearValidate();
        }, 50);
      }
     }
    },
    "oilgasinfoFormParams.oilRetailPrice": {
      handler(newV) {
        const {oilChangeType,oilMemberAgio,oilMemberDiscount} = this.oilgasinfoFormParams
        let num = null
        if(!(newV && number2(newV))) return
        switch (oilChangeType){
          case Dict.ADJUST_BY_DISCOUNT:
            if(!oilMemberAgio) return
            num = ByDiscount(Number(newV),oilMemberAgio)
            this.computedOilMemberPrice(num);
            break;
          case Dict.ADJUST_BY_CHEAP:
            if(!oilMemberDiscount || Number(newV) <= oilMemberDiscount) return
            num = ByCheap(Number(newV),oilMemberDiscount)
            this.computedOilMemberPrice(num);
            break; 
          default:
            break;             
        }
      }
    },
    "oilgasinfoFormParams.oilMemberDiscount": {
      handler(newV) {
        const {oilChangeType,oilRetailPrice} = this.oilgasinfoFormParams
        if(!(newV && number2(newV))) return
        if(oilChangeType === Dict.ADJUST_BY_DISCOUNT || !oilRetailPrice) return
        if(Number(newV) >= Number(oilRetailPrice)) return;
        let num = ByCheap(Number(oilRetailPrice),Number(newV))
        this.computedOilMemberPrice(num);                  
      }
    },
    "oilgasinfoFormParams.oilMemberAgio":{
      handler(newV) {
        const {oilChangeType,oilRetailPrice} = this.oilgasinfoFormParams
        if(oilChangeType === Dict.ADJUST_BY_CHEAP) return
        if(!(newV && number2(newV))) return
        if(!oilRetailPrice) return
        let num = ByDiscount(Number(newV),oilRetailPrice)
        this.computedOilMemberPrice(num);
      }        
    }
  }
};
</script>
<style scoped lang="less">
</style>
