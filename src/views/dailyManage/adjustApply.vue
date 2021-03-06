<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>油气品名称</label>
        <div class="form-control">
          <el-select v-model="form.oilModelId">
            <el-option
              v-for="(item,index) in ModelList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <el-button
          type="primary"
          :loading="isListDataLoading"
          @click="getListDataBylistParams"
          size="small"
        >查询</el-button>
        <el-button size="small" @click="clearListParams">重置</el-button>
      </div>
    </div>
    <HletongTable
      ref="tb"
      @sizeChange="changePageSize"
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :data="listData.list"
      :blankCol="false"
      :loading="isListDataLoading"
    >
      <el-table-column
        :align="item.align || 'left'"
        :prop="item.prop"
        :label="item.label"
        :key="item.id"
        v-for="(item) in tableHeader"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="scope">
          <span>{{listData.list[scope.$index][item.prop]}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="apply(listData.list[scope.$index])">调价申请</el-button>
          <el-button type="text" @click="history(listData.list[scope.$index])">调价历史</el-button>
        </template>
      </el-table-column>
    </HletongTable>
    <applyDialog
      :loading="isApplyLoading"
      :visible="applyVisible"
      :data="applyData"
      :cancelCb="()=>{this.applyVisible = false}"
      :confirmCb="(data)=>{this._updateApply(data)}"
    ></applyDialog>

    <adjustHistoryDialog ref="history" :gsOilModelId="setId"></adjustHistoryDialog>
  </div>
</template>

<script>
import Dict from "util/dict.js";
import applyDialog from "./applyDialog";
// import heltable from "components/hl_table";
import adjustHistoryDialog from "./adjustHistoryDialog";

const defaultFormData = {
  oilModelId: null,
};
const defaultListParams = {
  pageSize: 20,
  page: 1
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};
const defaulttableHeader = [
  {
    prop: "oilModelName",
    label: "油气品分类"
  },
  {
    prop: "oilChangeTypeText",
    label: "调价方式"
  },
  {
    prop: "oilRetailPriceText",
    label: "挂牌零售价"
  },
  {
    prop: "oilMemberPriceText",
    label: "会员价",
  },
  {
    prop: "oilMemberAgioText",
    label: "会员折扣(%)",
    align: "right"
  },
  {
    prop: "oilMemberDiscountText",
    label: "会员优惠(元)",
    align: "right"
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
        oilMemberAgioText: `${row.oilMemberAgio ? row.oilMemberAgio : "/"}`,
        oilMemberDiscountText: `${
          row.oilMemberDiscount ? row.oilMemberDiscount : "/"
        }`,
        oilRetailPriceText: `${row.oilRetailPrice}${row.oilUnit}/元`,
        oilMemberPriceText: `${row.oilMemberPrice}${row.oilUnit}/元`,
        oilChangeTypeText: `${Dict.ADJUST_PRICE_TYPE[row.oilChangeType]}`
      });
    });
  }
  return list;
};

export default {
  name: "adjustApply",
  components: {
    // heltable,
    applyDialog,
    adjustHistoryDialog
  },
  data() {
    return {
      breadTitle: ["日常管理", "调价申请"],
      isApplyLoading: false,
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      applyVisible: false,
      applyData: Object.create(null),
      setId: null,
      ModelList: []
    };
  },
  methods: {
    apply(row) {
      this.applyData = row;
      this.applyVisible = true;
    },
    history(row) {
      this.setId = row.id;
      this.$refs.history.open();
    },
    clearListParams() {
      this.form = { ...defaultFormData };
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
      this.getListData();
    },
    changePage(page) {
      this.listParams.page = page;
      this.getListData();
    },
    changePageSize(pageSize) {
      this.listParams = { ...defaultListParams, pageSize: pageSize };
      this.getListData();
    },
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.getAdjustApply({
        ...this.form,
        ...this.listParams
      });
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = { ...res.data, list: rowAdapter(res.data.list) };
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getModelList() {
      const res = await this.$api.getModelList();
      switch (res.code) {
        case Dict.SUCCESS:
          this.ModelList = res.data.map(item => {
            return {
              label: item.oilModelName,
              value: item.id
            };
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _updateApply(data) {
      this.isApplyLoading = true;
      const res = await this.$api.updateGasOilMode(data);
      this.isApplyLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("调价申请成功");
          this.applyVisible = false;
          this.applyData = Object.create(null);
          this.getListData();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    getGs(obj) {
      this.form.gsId = obj.gsId;
      this.form.gsName = obj.gsName;
      // console.log(obj)
    },
    init() {
      setTimeout(() => {
        this.clearListParams();
        this._getModelList();
        this.perm();
      }, 20);
      this.perm();
    },
    perm() {}
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped lang="less">
.search-box {
  flex-wrap: wrap;
  margin: 0;
  .form-item {
    padding-top: 20px;
    .el-button {
      margin-top: 17px;
    }
  }
}
</style>
