<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="memberForm">
      <el-form ref="form" :model="form" label-width="130px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <div class="head">公司信息</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="6" :sm="24" :xs="24">
              <el-form-item
                label="所属公司:"
                prop="userId"
                :rules="[{ required: true, message: '必须选择一个公司'  }]"
              >
                <companyglass @companySelect="_getCompanyInfo"></companyglass>
                <el-input type="hidden" :value="form.userId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="公司名称:">{{form.name}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="统一社会信用代码:">{{form.creditCode}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="公司地址:">{{form.address}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="公司类型:">{{form.entType_}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="法人:">{{form.legalPersonName}}</el-form-item>
            </el-col>
            <el-col :md="24" :sm="24" :xs="24">
              <el-form-item label="营业有效期:">{{form.effectiveDt}} - {{form.expireDt}}</el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <el-row>
            <el-col :md="24" :sm="24" :xs="24">
              <div class="head">入会协议</div>
            </el-col>
          </el-row>
          <el-table :data="form.agreementList" stripe border>
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
            <el-table-column label="协议有效期" align="center" width="200">
              <template slot-scope="scope">
                <span>{{form.agreementList[scope.$index].effectTimeText}}-{{form.agreementList[scope.$index].dueTimeText}}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议图片">
              <template slot-scope="scope">
                <div class="goods">
                  <div class="avatar">
                    <img
                      :key="index"
                      v-for="(pic,index) in form.agreementList[scope.$index].picUrlList"
                      width="65"
                      height="64"
                      :src="pic"
                    />
                  </div>
                </div>
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
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm">确定</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <agreedialog
      :cancleCb="()=>{this.setAgreeDialogVisible(false)}"
      :confirmCb="(agreeData)=>{_update_(agreeData)}"
    ></agreedialog>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapState, mapMutations, mapActions } from "vuex";
import Dict from "util/dict.js";
import hlBreadcrumb from "components/hl-breadcrumb";
import companyglass from "components/companyglass";
import agreedialog from "./agreedialog";
const defaulttableHeader = [
  {
    prop: "agreementName",
    label: "协议名称",
    width: "250"
  },
  {
    prop: "agreementTypeCodeText",
    label: "协议类型",
    width: "150"
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

const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row,
        agreementTypeCodeText: `${Dict.AGREE_TYPE[row.agreementTypeCode]}`,
        effectTimeText: moment(row.effectTime).format("YYYY-MM-DD"),
        dueTimeText: row.dueTime
          ? moment(row.effectTime).format("YYYY-MM-DD")
          : "长期"
      });
    });
  }
  return list;
};

const Adapter = obj => {
  return Object.assign({}, obj, {
    agreementTypeCodeText: `${Dict.AGREE_TYPE[obj.agreementTypeCode]}`,
    effectTimeText: moment(obj.effectTime).format("YYYY-MM-DD"),
    dueTimeText: obj.dueTime
      ? moment(obj.dueTime).format("YYYY-MM-DD")
      : "长期"
  });
};

export default {
  name: "memberForm",
  data() {
    return {
      fit: "fill",
      loading: false,
      form: { ...defualtFormParams },
      tableHeader: defaulttableHeader,
      /**新增的时候是-1,编辑的时候就是数组的序号 */
      editIndex: -1
    };
  },
  components: {
    hlBreadcrumb,
    companyglass,
    agreedialog
  },
  methods: {
    ...mapMutations("agreement", [
      "setAgreeDialogEdit",
      "setAgreeFormParams",
      "setAgreeDialogVisible"
    ]),
    ...mapActions("agreement", ["openAddAgreeDialog", "openEditAgreeDialog","clearAll"]),
    GoSeller() {
      this.$router.push({
        path: "/web/hyw/member/member/pageSeller"
      });
    },
    GoBuyer() {
      this.$router.push({
        path: "/web/hyw/member/member/pageBuyer"
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
    async _getVIPInfo(userId) {
      const res = await this.$api.getVIPInfo({ userId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.form = {
            ...res.data,
            agreementList: rowAdapter(res.data.agreementList)
          };
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
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
      setTimeout(()=>{
          that.setAgreeDialogVisible(false)
      },50)
    },
    _filter(){
      let params = _.cloneDeep(this.form);
      params.agreementList = params.agreementList.map((item)=>{
        return {...item,userId:this.form.userId}
      })
      return params
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
          if (this.isEdit) {
            this._updateVIP_(params);
          } else {
            this._addVIP_(params);
          }
        } else {
          return false;
        }
      });
    },
    async _updateVIP_(params){
      this.loading = true;
      const res = await this.$api.UpdateVIP(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("更新成功");
          if (this.memberType === Dict.SELLER_VIP) {
            this.GoSeller();
          } else {
            this.GoBuyer();
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _addVIP_(params){
      this.loading = true;
      const res = await this.$api.AddVIP(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("新增成功");
          if (this.memberType === Dict.SELLER_VIP) {
            this.GoSeller();
          } else {
            this.GoBuyer();
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  computed: {
    ...mapState("memberForm", ["memberType", "isEdit", "memberId"]),
    breadTitle() {
      const TypeText = this.memberType === Dict.SELLER_VIP ? "卖方" : "买方";
      const EditText = this.isEdit ? "编辑" : "新增";
      return ["会员管理", `${TypeText}管理`, `${EditText}${TypeText}`];
    }
  },
  mounted() {
    if (!this.memberType) {
      this.GoSeller();
      return;
    }
    if (this.isEdit && this.memberId) {
      this._getVIPInfo(this.memberId);
      console.info("这是编辑页面");
    } else {
      console.info("这是新增页面");
    }
  }
};
</script>

<style lang="less" scoped>
.memberForm {
  padding: 30px 15px 50px 15px;
  .el-table thead {
    color: #909399;
    font-weight: 500;
    background: #eee;
  }
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 700;
    }
    .uploadDeal {
      font-size: 12px;
      color: #909399;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border: 1px dashed #eee;
      &:hover{
        color: #ff0000;
        cursor:pointer 
      }
    }
  }
  .goods {
    position: relative;
    padding: 9px 10px 11px 15px;
    font-size: 0px;
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        border-radius: 2px;
        margin-left: 5px;
      }
    }
  }
}
</style>

