<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
      <el-button class="hlB_buts" size="small" icon="el-icon-plus" @click="add">新增</el-button>
    </hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>会员账户</label>
        <div class="form-control">
          <el-input v-model="form.phone" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>公司名称</label>
        <div class="form-control">
          <el-input v-model="form.name" placeholder="请输入" size="small"></el-input>
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

      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(listData.list[scope.$index])">编辑</el-button>
          <el-button
            type="text"
            @click="toggle(listData.list[scope.$index])"
          >{{listData.list[scope.$index].state === VIP_STATUS_NORMAL ? "禁用" : "激活"}}</el-button>
        </template>
      </el-table-column>
    </heltable>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Dict from "util/dict.js";
import heltable from "components/hl_table";
import hlBreadcrumb from "components/hl-breadcrumb";

const defaultFormData = {
  name: null,
  phone: null
};
const defaultListParams = {
  pageSize: 20,
  page: 1,
  memberType: Dict.BUYER_VIP // 买家
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
    prop: "phone",
    label: "会员账户"
  },
  {
    prop: "name",
    label: "公司名称"
  },
  {
    prop: "mock4",
    label: "公司电话"
  },
  {
    prop: "address",
    label: "公司地址"
  },
  {
    prop: "settledTime",
    label: "入驻日期"
  },
  {
    prop: "stateText",
    label: "买家会员状态"
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
        stateText: `${Dict.VIP_STATUS[row.state]}`
      });
    });
  }
  return list;
};

export default {
  name: "buyerVipManage",
  components: {
    heltable,
    hlBreadcrumb
  },
  data() {
    return {
      breadTitle: ["会员管理", "买家管理"],
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
    toggle(item) {
      let that = this;
      const { state, userId } = item;
      const text = state === Dict.VIP_STATUS_NORMAL ? "禁用买家" : "激活买家";
      that
        .$confirm(`确定${text}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(async () => {
          const res = await that.$api.vipEnable({
            state:
              state === Dict.VIP_STATUS_NORMAL
                ? Dict.VIP_STATUS_FROZEN
                : Dict.VIP_STATUS_NORMAL,
            userId: userId
          });
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
      const res = await this.$api.getBuyerVIPList({
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
      this.setIsEdit(false);
      this.setMemberType(Dict.BUYER_VIP);
      this.setMemberId(null);
      this.$router.push({
        path: "/web/hyw/member/member/memberForm"
      });
    },
    edit(item) {
      const { userId } = item;
      this.setIsEdit(true);
      this.setMemberType(Dict.BUYER_VIP);
      this.setMemberId(userId);
      this.$router.push({
        path: "/web/hyw/member/member/memberForm"
      });
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
