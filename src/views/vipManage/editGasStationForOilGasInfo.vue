<template>
  <div class="memberForm">
    <div class="form-block">
      <div class="head">油气品信息</div>
      <div class="dialogtb">
        <el-table
          :data="gasOilModelList"
          v-loading="isLoading"
          :header-cell-style="tableHeaderColor"
          stripe
          border
        >
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width || 'auto'"
            :align="item.align || 'left'"
            header-align="center"
            :key="index"
            v-for="(item,index) in tableHeader"
          >
            <template slot-scope="scope">
              <span>{{gasOilModelList[scope.$index][item.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="editDeal(gasOilModelList[scope.$index],scope.$index)"
              >编辑</el-button>
              <el-button type="text" @click="del(gasOilModelList[scope.$index])">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="right">
          <el-pagination
            @current-change="changePage"
            :current-page="listParams.page"
            :page-size="listParams.pageSize"
            layout="total, prev, pager, next"
            :total="listData.paginator.totalCount"
          ></el-pagination>
        </div> -->
        <div class="uploadDeal" @click="addDeal">
          <i class="el-icon-plus"></i>新增油气品信息
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button @click="GoMember" size="small">
        <span>取消</span>
      </el-button>
    </div>
    <oilGasInfodialog
      :OilModelList="ModelList"
      :cancleCb="()=>{this.setOilGasInfoDialogVisible(false)}"
      :confirmCb="(oilData)=>{this.addEdit(oilData)}"
      :loading="loading"
    ></oilGasInfodialog>
    <div class="images" v-show="false" v-viewer="{inline: false}">
      <img v-for="(src,index) in images" :src="src" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Dict from "util/dict.js";
import {deepMerge} from "common/util.js";
import oilGasInfodialog from "./oilGasInfodialog";
// const defaultListParams = {
//   pageSize: 20,
//   page: 1
// };
// const defaultListData = {
//   paginator: {
//     totalCount: 0,
//     totalPage: 1
//   }
// };

const defaulttableHeader = [
  {
    prop: "oilModelName",
    label: "油气品分类"
  },
  {
    prop: "oilRetailPriceText",
    label: "挂牌零售价"
  },
  {
    prop: "oilChangeTypeText",
    label: "调价方式"
  },
  {
    prop: "oilMemberAgioText",
    label: "会员折扣(%)"
  },
  {
    prop: "oilMemberDiscountText",
    label: "会员优惠(元)"
  },
  {
    prop: "oilMemberPriceText",
    label: "会员价"
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
        oilRetailPriceText: `${row.oilRetailPrice}元/${row.oilUnit}`,
        oilMemberAgioText: `${row.oilMemberAgio ? row.oilMemberAgio : "/"}`,
        oilMemberDiscountText: `${
          row.oilMemberDiscount ? row.oilMemberDiscount : "/"
        }`,
        oilMemberPriceText: `${row.oilMemberPrice}${row.oilUnit}/元`,
        oilChangeTypeText: `${Dict.ADJUST_PRICE_TYPE[row.oilChangeType]}`
      });
    });
  }
  return list;
};

export default {
  name: "editGasStationForOilGasInfo",
  data() {
    return {
      loading: false,
      isLoading: false,
      // listParams: { ...defaultListParams }, // 页数
      listData: [], // 返回list的数据结构
      gasOilModelList: [],
      ModelList:[],
      tableHeader: defaulttableHeader,
      images: []
    };
  },
  components: {
    oilGasInfodialog
  },
  computed: {
    ...mapState("gasStationForm", ["gsId", "gsFormEdit"]),
    ...mapState("oilGasInfo", ["oilgasinfodialogEdit"])
  },
  methods: {
    ...mapMutations("oilGasInfo", ["setOilGasInfoDialogVisible"]),
    ...mapActions("oilGasInfo", ["openAddOilGasInfoDialog", "openEditOilGasInfoDialog"]),
    GoMember() {
      this.$emit("oilGasInfoClose");
    },
    del(item) {
      let that = this;
      const { id,gsId,oilModelId,oilModelName } = item;
      const text = "删除油气品型号";
      that.$confirm(`确定?${text}${oilModelName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await that.$api.DelOilPrice({ id,gsId,oilModelId });
          switch (res.code) {
            case Dict.SUCCESS:
              that.$messageSuccess(`${text}成功`);
              that._getOilGasStationList(that.gsId);
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
      this.openAddOilGasInfoDialog();
    },
    editDeal(item) {
      this.openEditOilGasInfoDialog(deepMerge(item));
    },
    /**油气品分类List*/   
    async _getModelList() {
      const res = await this.$api.getModelList();
      switch (res.code) {
        case Dict.SUCCESS:
          this.ModelList = res.data.map(item => {
            return {
              label: item.oilModelName,
              value: item.id,
              oilUnit: item.oilUnit
            };
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getOilGasStationList(gsId) {
      this.isLoading = true;
      const res = await this.$api.queryOilPrice({
        // ...this.listParams,
        gsId
      });
      this.isLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          this.gasOilModelList = rowAdapter(res.data);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async addEdit(oilData) {
      const text = this.oilgasinfodialogEdit ? "更新" : "新增";
      const url = this.oilgasinfodialogEdit ? "UpdateOilPrice" : "AddOilPrice";
      this.loading = true;
      const res = await this.$api[url](oilData);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess(`${text}油气品信息成功`);
          this._getOilGasStationList(this.gsId);
          setTimeout(() => {
            this.setOilGasInfoDialogVisible(false);
          }, 50);
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    // changePage(page) {
    //   this.listParams.page = page;
    //   this._getOilGasStationList(this.gsId);
    // },
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
    if (!this.gsId || !this.gsFormEdit) {
      this.GoMember();
      return;
    }
    this._getOilGasStationList(this.gsId).then(()=>{
      this._getModelList();
    });
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

