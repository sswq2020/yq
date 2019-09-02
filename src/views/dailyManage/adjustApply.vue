<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>油气品名称</label>
        <div class="form-control">
          <el-input v-model="form.oilModelName" placeholder="请输入" size="small"></el-input>
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
    <heltable
      ref="tb"
      @sizeChange="changePageSize"
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :data="listData.list"
      :loading="isListDataLoading"
    >
      <el-table-column
        align="center"
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
    </heltable>
  </div>
</template>

<script>
import { requestParamsByTimeRange } from "common/util.js";
import _ from "lodash";
import Dict from "util/dict.js";
import heltable from "components/hl_table";
import hlBreadcrumb from "components/hl-breadcrumb";

const defaultFormData = {
  gsId: null,
  gsName: null,
  timeRange: []
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
    prop: "oilRetailPrice",
    label: "挂牌零售价"
  },
  {
    prop: "oilMemberPrice",
    label: "会员价"
  },
  {
    prop: "oilMemberAgio",
    label: "会员折扣"
  },
  {
    prop: "oilMemberDiscount",
    label: "会员优惠(元)"
  }
];

export default {
  name: "adjustApply",
  components: {
    heltable,
    hlBreadcrumb,
    gsStationglass
  },
  data() {
    return {
      breadTitle: ["日常管理", "调价申请"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true
    };
  },
  methods: {
    _filter() {
      const { timeRange } = this.form;
      const _reqParams_ = requestParamsByTimeRange(
        this.form,
        timeRange,
        ...EXTRA_PARAMS_KEYS
      );
      return _.clone(Object.assign({}, _reqParams_, this.listParams));
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
      let obj = this._filter();
      this.isListDataLoading = true;
      const res = await this.$api.getAdjustOilHistory(obj);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
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
