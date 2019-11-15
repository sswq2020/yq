<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>用户名</label>
        <div class="form-control">
          <el-input v-model="form.username" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>公司名称</label>
        <div class="form-control">
          <el-input v-model="form.name" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>油气站名称</label>
        <div class="form-control">
          <el-input v-model="form.gsName" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>到期日期</label>
        <div class="form-control">
          <el-date-picker
            v-model="form.timeRange"
            size="small"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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
    </HletongTable>
  </div>
</template>

<script>
import { requestParamsByTimeRange } from "common/util.js";
import _ from "lodash";
import Dict from "util/dict.js";

/**只是请求参数的key,页面中的观察属性却不需要，只在请求的那一刻由timeRange赋值*/
const EXTRA_PARAMS_KEYS = ["startTime", "endTime"];

const defaultFormData = {
  username: null,
  name: null,
  gsName:null,
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
    prop: "username",
    label: "用户名"
  },
  {
    prop: "name",
    label: "公司名称"
  },
  {
    prop: "gsName",
    label: "油气站名称"
  },
  {
    prop: "agreementName",
    label: "到期协议"
  },
  {
    prop: "dueTime",
    label: "到期时间"
  }
];

export default {
  name: "dealDueforeWarn",
  data() {
    return {
      breadTitle: ["预警管理", "协议到期预警"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      visible: false,
      contentId:"customers",
      bill:[],
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
      this.listParams = { ...defaultListParams, pageSize:pageSize };
      this.getListData();      
    },
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    async getListData() {
      let obj = this._filter();
      this.isListDataLoading = true;
      const res = await this.$api.getDealDueForeWarnList(obj);
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData =res.data;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
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
