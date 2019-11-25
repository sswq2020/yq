<template>
  <div class="container single-page">
    <!-- <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb> -->
    <div class="form">
      <el-form ref="form" :model="form" label-width="200px" size="small">
        <div class="form-block">
          <div class="head">公司信息</div>
          <el-row>
            <el-col :md="8" :sm="24" :xs="24">
              <el-form-item
                label="所属公司"
                prop="userId"
                :rules="[{ required: true, message: '必须选择一个公司'}]"
              >
                <companyglass @companySelect="_getCompanyInfo" :disabled="isEdit"></companyglass>
                <el-input type="hidden" :value="form.userId" style="display:inline;height:0"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.userId">
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="公司名称">{{form.name}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="统一社会信用代码">{{form.creditCode}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="公司地址">{{form.address}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="公司类型">{{form.entType_}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="法人">{{form.legalPersonName}}</el-form-item>
            </el-col>
            <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <el-form-item label="营业有效期">{{form.effectiveDt}} - {{form.expireDt}}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">入会协议</div>
          <el-table :data="form.agreementList" :header-cell-style="tableHeaderColor" stripe border>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :width="item.width || 'auto'"
              :align="item.align || 'center'"
              header-align="center"
              :key="index"
              v-for="(item,index) in tableHeader"
            >
              <template slot-scope="scope">
                <span>{{form.agreementList[scope.$index][item.prop]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议有效期" align="center">
              <template slot-scope="scope">
                <span>{{form.agreementList[scope.$index].effectTimeText}}-{{form.agreementList[scope.$index].dueTimeText}}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议图片" align="center">
              >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="form.agreementList&&form.agreementList.length"
                  @click="openImage(form.agreementList[scope.$index])"
                >点击查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editDeal(form.agreementList[scope.$index],scope.$index)"
                >编辑</el-button>
                <el-button type="text" @click="deleteDeal(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="uploadDeal" @click="addDeal">
            <i class="el-icon-plus"></i>上传协议
          </div>
        </div>
      </el-form>
    </div>
    <div class="bottom">
      <el-button type="primary" size="small" :loading="loading" @click="submitForm">确定</el-button>
      <el-button size="small" @click="back">取消</el-button>
    </div>
    <agreedialog
      :cancleCb="()=>{this.setAgreeDialogVisible(false)}"
      :confirmCb="(agreeData)=>{_update_(agreeData)}"
    ></agreedialog>
    <div class="images" style="display:none" v-viewer="{inline: false}">
      <img v-for="(src,index) in images" :src="src" :key="index" />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapState, mapMutations, mapActions } from "vuex";
import Dict from "util/dict.js";
import companyglass from "components/companyglass";
import agreedialog from "./agreedialog";
const defaulttableHeader = [
  {
    prop: "agreementName",
    label: "协议名称"
  },
  {
    prop: "contractCompany",
    label: "签约公司"
  }
];

const defualtFormParams = {
  userId: null,
  name: null,
  creditCode: null,
  address: null,
  entType_: null,
  legalPersonName: null,
  effectiveDt: null,
  expireDt: null,
  agreementList: []
};

const Adapter = obj => {
  return Object.assign({}, obj, {
    effectTimeText: moment(obj.effectTime).format("YYYY-MM-DD"),
    dueTimeText: obj.dueTime ? moment(obj.dueTime).format("YYYY-MM-DD") : "长期"
  });
};

export default {
  name: "addGasStationForm",
  data() {
    return {
      fit: "fill",
      loading: false,
      form: { ...defualtFormParams, agreementList: [] },
      tableHeader: defaulttableHeader,
      /**新增的时候是-1,编辑的时候就是数组的序号 */
      editIndex: -1,
      images: []
    };
  },
  components: {
    companyglass,
    agreedialog
  },
  methods: {
    ...mapMutations("agreement", [
      "setAgreeDialogEdit",
      "setAgreeFormParams",
      "setAgreeDialogVisible"
    ]),
    ...mapActions("agreement", [
      "openAddAgreeDialog",
      "openEditAgreeDialog",
      "clearAll"
    ]),
    back() {
      this.$router.push({
        path: "/web/base/gas/page"
      });
    },
    _getCompanyInfo(obj) {
      const {
        userId,
        name,
        creditCode,
        legalPersonName,
        address,
        effectiveDt,
        expireDt,
        entType_
      } = obj;
      this.form = Object.assign({}, this.form, {
        userId,
        name,
        creditCode,
        legalPersonName,
        address,
        effectiveDt,
        expireDt,
        entType_
      });
    },
    editDeal(item, index) {
      const { picUrlList } = item;
      this.editIndex = index;
      this.openEditAgreeDialog({ ...item, picLength: picUrlList.length });
    },
    deleteDeal(index) {
      this.form.agreementList.splice(index, 1);
    },
    addDeal() {
      this.editIndex = -1;
      this.openAddAgreeDialog();
    },
    _update_(agreeData) {
      let that = this;
      if (this.editIndex > -1) {
        this.form.agreementList.splice(this.editIndex, 1, Adapter(agreeData)); // 不要直接使用array[index] = item,Vue无法观察数组的变化,必须用变异的函数,这也是弹窗里图片变化.使用了splice和push这种变异的方法
      } else {
        this.form.agreementList.push(Adapter(agreeData));
      }
      setTimeout(() => {
        that.setAgreeDialogVisible(false);
      }, 50);
    },
    _filter() {
      let params = _.cloneDeep(this.form);
      params.agreementList = params.agreementList.map(item => {
        return { ...item, userId: this.form.userId };
      });
      return params;
    },
    submitForm() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (that.form.agreementList.length === 0) {
            that.$messageError("必须上传一个协议列表");
            return;
          }
          const params = this._filter();
          this._addVIP_(params);
        } else {
          return false;
        }
      });
    },
    async _addVIP_(params) {
      this.loading = true;
      const res = await this.$api.AddVIP(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("新增成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    openImage(item) {
      this.images = item.picUrlList;
      setTimeout(() => {
        const viewer = this.$el.querySelector(".images").$viewer;
        viewer.show();
      }, 500);
    },
    // 修改table header的背景色
    tableHeaderColor({ rowIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F6F8FA;color: #262626;font-weight: 500;";
      }
    }
  },
  computed: {
    ...mapState("memberForm", ["isEdit", "memberId"]),
    breadTitle() {
      const EditText = this.isEdit ? "编辑" : "新增";
      return ["会员管理", "交易会员管理", `${EditText}会员`];
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 20px 15px 50px 20px;
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 20px;
      padding-left: 20px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #333333;
      background: #f6f8fa;
    }
    .uploadDeal {
      margin-top: 10px;
      font-size: 12px;
      color: #909399;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 2px dashed #eee;
      &:hover {
        color: #ff0000;
        cursor: pointer;
      }
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
    &:last-child{
      margin-left: 16px;
    }
  }
}
</style>

    