<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle">
    </HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>用户名</label>
        <div class="form-control">
          <el-input v-model="form.username" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>手机号</label>
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
          <el-button type="text" @click="go(listData.list[scope.$index])">油气站管理</el-button>
        </template>
      </el-table-column>
    </heltable>
    <!-- <UserDialog :visible.sync="visible"  @updateVisible="updateVisible">
      <el-tab-pane label="入会协议" v-if="visible">
        <editMemberForm @agreemtClose="updateVisible(false)"/>
      </el-tab-pane>
    </UserDialog> -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Dict from "util/dict.js";
import heltable from "components/hl_table";
// import UserDialog from 'components/userDialog';
// import editMemberForm from './editMemberForm.vue'

const defaultFormData = {
  name: null,
  phone: null,
  username:null
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
    prop: "phone",
    label: "手机号"
  },
  {
    prop: "name",
    label: "公司名称"
  },
  {
    prop: "telNo",
    label: "公司电话"
  },
  {
    prop: "addressText",
    label: "公司地址",
    width:"300px"
  },
  {
    prop: "grantTime",
    label: "授权日期",
    align:"right"
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
        addressText:`${row.province || ''}${row.city || ''}${row.county || ''}${row.address || ''}`,
        stateText: `${Dict.VIP_STATUS[row.state]}`
      });
    });
  }
  return list;
};

export default {
  name: "vipManage",
  components: {
      heltable
    // UserDialog,
    // editMemberForm
  },
  data() {
    return {
      breadTitle: ["会员管理", "加油站会员"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      VIP_STATUS_NORMAL: Dict.VIP_STATUS_NORMAL,
      visible:false
    };
  },
  methods: {
    updateVisible(bol){
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
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.getVIPList({
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
    go(item){
      this.$router.push({
         name:"gasStationManage",
         params:item
      })
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
