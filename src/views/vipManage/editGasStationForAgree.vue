<template>
  <div class="memberForm">
      <div class="form-block">
        <div class="head">入会协议</div>
        <div class="dialogtb">
          <el-table
            :data="agreementList"
            v-loading="isLoading"
            :header-cell-style="tableHeaderColor"
            stripe
            border
          >
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
                <span>{{agreementList[scope.$index][item.prop]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议有效期" align="center">
              <template slot-scope="scope">
                <span>{{agreementList[scope.$index].effectTimeText}}-{{agreementList[scope.$index].dueTimeText}}</span>
              </template>
            </el-table-column>
            <el-table-column label="协议图片" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="openImage(agreementList[scope.$index])">点击查看</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="editDeal(agreementList[scope.$index],scope.$index)"
                >编辑</el-button>
                <el-button type="text" @click="del(agreementList[scope.$index])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="right">
            <el-pagination
              @current-change="changePage"
              :current-page="listParams.page"
              :page-size="listParams.pageSize"
              layout="total, prev, pager, next"
              :total="listData.paginator.totalCount"
            ></el-pagination>
          </div>
          <div class="uploadDeal" @click="addDeal">
            <i class="el-icon-plus"></i>上传协议
          </div>
        </div>
      </div>
    <div class="footer">
      <el-button @click="GoMember" size="small">
        <span>取消</span>
      </el-button>
    </div>
    <agreedialog
      :cancleCb="()=>{this.setAgreeDialogVisible(false)}"
      :confirmCb="(agreeData)=>{this.addEdit(agreeData)}"
      :loading="loading"
    ></agreedialog>
    <div class="images" v-show="false" v-viewer="{inline: false}">
      <img v-for="(src,index) in images" :src="src" :key="index" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapMutations, mapActions } from "vuex";
import Dict from "util/dict.js";
import agreedialog from "./agreedialog";
const defaultListParams = {
  pageSize: 20,
  page: 1
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  }
};

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

const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row,
        effectTimeText: moment(row.effectTime).format("YYYY-MM-DD"),
        dueTimeText: row.dueTime
          ? moment(row.dueTime).format("YYYY-MM-DD")
          : "长期"
      });
    });
  }
  return list;
};

export default {
  name: "editMemberForm",
  data() {
    return {
      fit: "fill",
      loading: false,
      isLoading: false,
      listParams: { ...defaultListParams }, // 页数
      listData: { ...defaultListData }, // 返回list的数据结构
      agreementList: [],
      tableHeader: defaulttableHeader,
      images: []
    };
  },
  components: {
    agreedialog
  },
  computed: {
    ...mapState("gasStationForm", ["gsId", "gsFormEdit"]),
    ...mapState("memberForm", ["memberId"]),
    ...mapState("agreement", ["agreedialogEdit"])
  },  
  methods: {
    ...mapMutations("agreement", [
      "setAgreeDialogEdit",
      "setAgreeFormParams",
      "setAgreeDialogVisible"
    ]),
    ...mapActions("agreement", ["openAddAgreeDialog", "openEditAgreeDialog"]),
    GoMember() {
      this.$emit("agreemtClose");
    },
    del(item) {
      let that = this;
      const { id } = item;
      const text = "删除入会协议";
      this.$confirm(`确定?${text}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await that.$api.DelAgreement({ id });
          switch (res.code) {
            case Dict.SUCCESS:
              that.$messageSuccess(`${text}成功`);
              that._getAgreementList(that.memberId,that.gsId);
              break;
            default:
              that.$messageError(`${text}失败,${res.mesg}`);
              break;
          }
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addDeal() {
      this.openAddAgreeDialog();
    },
    editDeal(item) {
      const { picUrlList } = item;
      this.openEditAgreeDialog({ ...item, picLength: picUrlList.length });
    },
    async _getAgreementList(userId,gsId) {
      this.isLoading = true;
      const res = await this.$api.getAgreementList({
        ...this.listParams,
        userId,
        gsId
      });
      this.isLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          this.agreementList = rowAdapter(res.data.list);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async addEdit(agreeData) {
      const text = this.agreedialogEdit ? "更新" : "新增";
      const url = this.agreedialogEdit ? "UpdateAgreement" : "AddAgreement";
      this.loading = true;
      agreeData.userId = this.memberId;
      agreeData.gsId = this.gsId;
      const res = await this.$api[url](agreeData);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess(`${text}入会协议成功`);
          this._getAgreementList(this.memberId,this.gsId);
          setTimeout(() => {
            this.setAgreeDialogVisible(false);
          }, 50);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    changePage(page) {
      this.listParams.page = page;
      this._getAgreementList(this.memberId,this.gsId);
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
  mounted() {
    if (!this.memberId || !this.gsFormEdit) {
      this.GoMember();
      return;
    }
    this._getAgreementList(this.memberId,this.gsId);
  }
};
</script>

<style lang="less" scoped>
.memberForm {
  margin: 15px 20px 50px 20px;
  background: white;
  .el-table thead {
    color: #909399;
    font-weight: 500;
    background: #eee;
  }
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 20px;
      box-sizing: border-box;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #e1e1e2;
      padding-left: 20px;
      font-size: 14px;
    }
    .dialogtb {
      padding: 0px 20px;
    }
    .uploadDeal {
      box-sizing: border-box;
      line-height: 30px;
      border: 1px dashed #d9d9d9;
      width: 100%;
      height: 30px;
      text-align: center;
      font-size: 14px;
      &:hover {
        color: #ff0000;
        cursor: pointer;
      }
    }
  }
  .right {
    text-align: right;
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 130px;
  right: 20px;
  z-index: 100;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 hsla(0, 0%, 80%, 0.5);
}
</style>

