<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="add"
        plain
        class="text-btn"
      >新增</el-button>
    </HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>用户名</label>
        <div class="form-control">
          <el-input v-model="form.username" placeholder="请输入" size="small"></el-input>
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
      <el-table-column label="特色服务ICON" width="120px" align="center">
        <template slot-scope="scope">
          <div style="padding: 10px 0px 0px 0px">
            <img width="48" height="48" :src="listData.list[scope.$index].fsIconUrl" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :align="item.align ||'left' "
        :width="item.width || null"
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

      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(listData.list[scope.$index])">编辑</el-button>
          <el-button
            type="text"
            @click="toggle(listData.list[scope.$index])"
          >{{listData.list[scope.$index].isBan === Dict.FEATURE_NOT_BAN ? "禁用" : "激活"}}</el-button>
        </template>
      </el-table-column>
    </HletongTable>
    <featureDialog
      :data="featureData"
      :visible="visible"
      :loading="loading"
      :isEdit="isEdit"
      :confirmCb="(file)=>{this._comfirm(file)}"
      :cancelCb="cancel"
    ></featureDialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Dict from "util/dict.js";
// import heltable from "components/hl_table";
import featureDialog from "./featureDialog";

const defaultFormData = {
  fsName: null
};
const defaultListParams = {
  pageSize: 10,
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
    prop: "fsName",
    label: "特色服务名称"
  },
  {
    prop: "isBanText",
    label: "状态"
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
        isBanText: `${Dict.FEATURE_STATUS[row.isBan]}`
      });
    });
  }
  return list;
};

export default {
  name: "feature",
  components: {
    // heltable,
    featureDialog
  },
  data() {
    return {
      breadTitle: ["基础信息", "特色服务管理"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      Dict,
      visible: false,
      /**特色管理的对象*/
      featureData: Object.create(null),
      /**弹窗的loading*/
      loading: false,
      /**弹窗编辑还是新增*/
      isEdit: false
    };
  },
  methods: {
    ...mapMutations("memberForm", ["setIsEdit", "setMemberId"]),
    updateVisible(bol) {
      this.visible = bol;
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
    toggle(item) {
      let that = this;
      const { isBan, id, fsName } = item;
      const text =
        isBan === Dict.FEATURE_NOT_BAN ? "禁用特色服务" : "激活特色服务";
      const serverUrl =
        isBan === Dict.FEATURE_NOT_BAN ? "banFeature" : "activeFeature";
      this.$confirm(`确定${text}${fsName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await that.$api[serverUrl]({ id });
          switch (res.code) {
            case Dict.SUCCESS:
              this.$messageSuccess(`${text}成功`);
              this.getListData();
              break;
            default:
              this.$messageError(`${text}失败,${res.mesg}`);
              break;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.getFeaturePage({
        ...this.listParams,
        ...this.form
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
    add() {
      this.featureData = Object.create(null);
      this.isEdit = false;
      this.visible = true;
    },
    edit(item) {
      this.featureData = item;
      this.isEdit = true;
      this.visible = true;
    },
    async _comfirm(item){
      const serverUrl = this.isEdit ? 'updateFeature':'addFeature';
      const text = this.isEdit ? '更新':'新增';
      this.loading = true;
      const res = await this.$api[serverUrl](item)
      this.loading = false
      switch (res.code) {
            case Dict.SUCCESS:
              this.$messageSuccess(`${text}成功`);
              this.cancel()
              this.getListData();
              break;
            default:
              this.$messageError(`${text}失败,${res.mesg}`);
              break;
          }
    },
    cancel(){
      this.visible = false;
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
