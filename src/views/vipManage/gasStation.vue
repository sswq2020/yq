<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>公司名称</label>
        <div class="form-control">
          <el-input v-model="form.username" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>油气站名称</label>
        <div class="form-control">
          <el-input v-model="form.gsName" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>油气站编号</label>
        <div class="form-control">
          <el-input v-model="form.gsCode" placeholder="请输入" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>油气站状态</label>
        <div class="form-control">
          <el-select v-model="form.isBan" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in gasStationStatustList"
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
      <el-table-column label="收款二维码" width="220px" align="left">
        <template slot-scope="scope">
          <el-button type="text">点击查看</el-button>
          <el-button type="text">下载二维码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120px" align="left">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(listData.list[scope.$index])"
          >{{listData.list[scope.$index].isBan === Dict.GAS_STATION_STATUS_NORMAL ? "禁用" : "正常"}}</el-button>
        </template>
      </el-table-column>
    </heltable>
    <!-- <UserDialog :visible.sync="visible"  @updateVisible="updateVisible">
      <el-tab-pane label="入会协议" v-if="visible">
        <editMemberForm @agreemtClose="updateVisible(false)"/>
      </el-tab-pane>
    </UserDialog>-->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Dict from "util/dict.js";
import { DICT_SELECT_ARR } from "common/util";
const gasStationStatustList = DICT_SELECT_ARR(Dict.GAS_STATION_STATUS);
import heltable from "components/hl_table";
// import UserDialog from 'components/userDialog';
// import editMemberForm from './editMemberForm.vue'

const defaultFormData = {
  name: null,
  phone: null,
  username: null
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
    prop: "name",
    label: "公司名称"
  },
  {
    prop: "gsName",
    label: "油气站名称"
  },
  {
    prop: "gsCode",
    label: "油气站编号"
  },
  {
    prop: "gsPhone",
    label: "油气站电话"
  },
  {
    prop: "gsContact",
    label: "油气站联系人"
  },
  {
    prop: "contactPhone",
    label: "联系人手机"
  },
  {
    prop: "gsEmail",
    label: "联系邮箱"
  },
  {
    prop: "AddressText",
    label: "油气站地址"
  },
  {
    prop: "isBanText",
    label: "油气站状态"
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
        AddressTest: `${row.gsProvinceName}${row.gsCityName}${row.gsRegionName}${row.gsDetailAddress}`,
        isBanText: `${Dict.GAS_STATION_STATUS[row.isBan]}`
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
      visible: false,
      gasStationStatustList,
      Dict
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
    filter(){
      const username = this.$route.params.name || null
      if(username) {
        this.form.username = username
      }
    },
    async getListData() {
      this.filter();
      this.isListDataLoading = true;
      const res = await this.$api.queryGasStation({
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
      this.setMemberId(null);
      this.$router.push({
        path: "/web/yc/member/member/addmemberForm"
      });
    },
    edit(item) {
      const { userId } = item;
      this.setIsEdit(true);
      this.setMemberId(userId);
      this.visible = true;
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
