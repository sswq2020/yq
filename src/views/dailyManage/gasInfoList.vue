<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
    </hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>加注日期</label>
        <div class="form-control">
          <el-date-picker format="yyyy-MM" value-format="yyyy-MM" v-model="form.createdTime" type="month" placeholder="选择月"></el-date-picker>
        </div>
      </div>
      <div class="form-item" v-if="!IS_OILVIP">
        <label>油气站名称</label>
        <div class="form-control">
          <gsStationglass :gsName="form.gsName" @gsStationSelect="getGs"></gsStationglass>
        </div>
      </div>
      <div class="form-item">
        <label>车牌号</label>
        <div class="form-control">
          <el-input v-model="form.userPlate" placeholder="请输入" size="small"></el-input>
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
import { mapMutations, mapGetters } from "vuex";
import Dict from "util/dict.js";
import heltable from "components/hl_table";
import hlBreadcrumb from "components/hl-breadcrumb";
import moment from "moment"
import gsStationglass from "components/gsStationglass";

const defaultFormData = {
  createdTime: moment().format("YYYY-MM"),
  gsId: null,
  gsName:null,
  userPlate: null
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
    prop: "userPlate",
    label: "车牌号"
  },
  {
    prop: "gsName",
    label: "油气站名称"
  },
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
    prop: "fuelVolume",
    label: "加注量"
  },
  {
    prop: "totalPrice",
    label: "加注金额"
  },
  {
    prop: "createdTime",
    label: "加注日期"
  }
];

const rowAdapter = list => {
  if (!list) {
    return [];
  }
  if (list.length > 0) {
    list = list.map(row => {
      return (row = {
        ...row
      });
    });
  }
  return list;
};

export default {
  name: "gasInfoList",
  components: {
    heltable,
    hlBreadcrumb,
    gsStationglass
  },
  computed: {
    ...mapGetters("app", ["IS_OILVIP", "userId"])
  },
  data() {
    return {
      breadTitle: ["日常管理", "加注明细"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      VIP_STATUS_NORMAL: Dict.VIP_STATUS_NORMAL
    };
  },
  methods: {
    ...mapMutations("memberForm", [
      "setIsEdit",
      "setMemberType",
      "setMemberId"
    ]),
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
    getGs(obj){
      this.form.gsId = obj.gsId;
      this.form.gsName = obj.gsName;
    },
    async getListData() {
      const url = this.IS_OILVIP
        ? "getOilVIPFillUpDetail"
        : "getPlantFillUpDetail";
      const params = this.IS_OILVIP
        ? { ...this.listParams, ...this.form, gsId: this.userId }
        : { ...this.listParams, ...this.form };
      this.isListDataLoading = true;
      const res = await this.$api[url](params);
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
