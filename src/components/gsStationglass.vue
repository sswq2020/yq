<template>
  <div class="gsStationglass">
    <el-input placeholder="请选择" :value="value" readonly>
      <el-button
        :disabled="disabled"
        slot="append"
        icon="el-icon-search"
        style="margin: -10px -20px;"
        @click="open"
      ></el-button>
    </el-input>
    <el-dialog
      title="油气站"
      width="1200px"
      :visible.sync="visible"
      :center="true"
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="search-box" style="padding:0px;margin:0px 0px 10px 0px;">
        <div class="form-item">
          <label style="line-height:1">油气站名称</label>
          <div class="form-control">
            <el-input v-model="form.gsName" placeholder="请输入" size="small"></el-input>
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
      <el-table
        v-loading="isListDataLoading"
        stylestripe
        border
        highlight-current-row
        :data="listData.list"
        @current-change="handleCurrentChange"
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
            <span>{{listData.list[scope.$index][item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tb_pagination">
        <el-pagination
          @current-change="changePage"
          :current-page="listParams.page"
          :page-size="listParams.pageSize"
          layout="total, prev, pager, next"
          :total="listData.paginator.totalCount"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="float:right">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="comfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Dict from "util/dict.js";
const defaultFormData = {
  gsName: null
};

const defaultListParams = {
  pageSize: 5,
  currentPage: 1 // 临时
  // page: 1  主要的
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};

const defaultAuditResultTableHeader = [
  {
    prop: "gsName",
    label: "油气站名称"
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
    prop: "AddressTest",
    label: "油气站地址"
  },
  {
    prop: "isBanText",
    label: "加油站状态"
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
        AddressTest:`${row.gsProvinceName}${row.gsCityName}${row.gsRegionName}${row.gsDetailAddress}`,
        isBanText: `${Dict.GAS_STATION_STATUS[row.isBan]}`
      });
    });
  }
  return list;
};

export default {
  name: "gsStationglass",
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: [...defaultAuditResultTableHeader],
      currentRow: null, //选中的那一行数据
      value:null
    };
  },
  methods: {
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
    clearListParams() {
      this.currentRow = null;
      this.form = { ...defaultFormData };
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
      this.getListData();
    },
    async getListData() {
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
    open() {
      this.visible = true;
    },
    cancel() {
      this.visible = false;
    },
    clearValue(){
      this.value = ""
    },    
    comfirm() {
      if (!this.currentRow) {
        this.$messageError("必须选中一行才能确认");
        return;
      }
      this.value = this.currentRow.gsName || "";
      this.$emit("gsStationSelect", this.currentRow);
      this.cancel();
    },
    handleCurrentChange(row) {
      this.currentRow = row;
    }
  },
  watch: {
    visible(newV) {
      if (newV) {
        this.clearListParams();
      }
    }
  }
};
</script>

<style scoped lang="less">
.search-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: white;
  font-size: 14px;
  .form-item {
    .el-button {
      margin-top: 20px;
    }
  }
}
.tb_pagination {
  text-align: right;
}
</style>

