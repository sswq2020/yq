<template>
  <el-dialog :show-close="false" :title="title" :visible="pricedialog" width="450px">
    <el-form
      :model="formParams"
      :rules="rules"
      ref="ruleForm"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="售价" prop="price">
        <el-input v-model="formParams.price"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="totalWeightInventory">
        <el-input v-model="formParams.totalWeightInventory"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="confirm" :loading="priceLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "pricedialog",
  props: {
    title:{
      type:String,
      default:''
    },
    confirmCb:{
      type:Function,
      default:()=>{}
    },
    priceLoading:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      isLoading:false,
      rules: {
        price: [{ required: true, message: "售价必填", trigger: "blur" }],
        totalWeightInventory: [
          { required: true, message: "库存必填", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState("commodityOnSale", [
      "formParams",
      "pricedialog",
    ]),
  },
  methods: {
    ...mapMutations("commodityOnSale", ["setPricedialog",'setFormParams']),
    open() {
      this.setPricedialog(true);
    },
    cancle() {
      this.setPricedialog(false);
    },
    confirm() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let parmas = JSON.parse(JSON.stringify(that.formParams));
          that.confirmCb(parmas);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    pricedialog(newV, oldV) {
      if (newV === false) {
        this.$refs.ruleForm.clearValidate();
      }
    }
  }
};
</script>
<style scoped lang="less">
</style>
