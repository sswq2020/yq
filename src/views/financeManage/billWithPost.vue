<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="form">
      <el-form label-width="120px" size="small">
        <div class="form-block">
          <div class="head">开票信息</div>
          <el-row>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="受票方名称:">{{invoiceDto.invoiceName}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="纳税人识别号:">{{invoiceDto.invoiceTaxpayer}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="开户行:">{{invoiceDto.invoiceBank}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="银行账号:">{{invoiceDto.invoiceBankCode}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="联系电话:">{{invoiceDto.invoiceTel}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="地址:">{{invoiceDto.invoiceAddress}}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">寄票地址信息</div>
          <el-row>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="寄票地址:">{{invoiceDto.receivingAddress}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="收票人:">{{invoiceDto.receivingAddressPerson}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="24" :sm="24" :xs="24">
              <el-form-item label="联系电话:">{{invoiceDto.receivingAddressTel}}</el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Dict from "util/dict.js";
const defaultInvoiceDtoParams = {
  id: null,
  invoiceName: null,
  invoiceTaxpayer: null,
  invoiceAddress: null,
  invoiceTel: null,
  invoiceBank: null,
  invoiceBankCode: null,
  receivingAddressPerson: null,
  receivingAddressTel: null,
  receivingAddress: null
};


export default {
  name: "billWithPost",
  data() {
    return {
      breadTitle: ["财务管理", "开票信息、寄票地址信息"],
      invoiceDto: { ...defaultInvoiceDtoParams }
    };
  },
  methods:{
    async _getInvoiceAddress() {
      this.isListDataLoading = true;
      const res = await this.$api.getInvoiceAddress();
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.invoiceDto = res.data.invoiceDto;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  created(){
      this._getInvoiceAddress();
  }
};
</script>


<style scoped lang="less">
.form {
  .form-block {
    padding: 20px;
    .head {
      margin-bottom: 20px;
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #333333;
      background: #f6f8fa;
    }
  }
}
.bottom {
  position: fixed;
  width: 86%;
  bottom: 20px;
  height: 50px;
  background-color: #f6f8fa;
  margin-left: 20px;
  box-shadow: 0 -1px 4px 0 hsla(0, 0%, 80%, 0.5);
  .el-button {
    min-width: 64px;
    margin-left: 20px;
    margin-top: 10px;
    &:last-child {
      margin-left: 16px;
    }
  }
}
</style>