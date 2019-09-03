<template>
  <el-dialog
    title="调价历史"
    width="1200px"
    :visible.sync="visible"
    :center="true"
    @close="cancel"
    :close-on-click-modal="false"
  >
    <el-table stylestripe :data="listData.list">
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :width="item.width || 'auto'"
        :align="item.align || 'center'"
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="comfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Dict from "util/dict.js";

const defaultListParams = {
  pageSize: 5,
  page: 1
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
    label: "会员折扣(%)"
  },
  {
    prop: "effectTime",
    label: "生效日期"
  },
  {
    prop: "applyTime",
    label: "调价申请日期"
  }
];

export default {
  name: "adjustHistoryDialog",
  props: {
    gsOilModelId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      visible: false,
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: [...defaultAuditResultTableHeader]
    };
  },
  methods: {
    changePage(page) {
      this.listParams.page = page;
      this.getListData();
    },
    clearListParams() {
      this.currentRow = null;
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
      this.getListData();
    },
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.getAdjustOilHistory({
        ...this.listParams,
        gsOilModelId: this.gsOilModelId
      });
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
    open() {
      this.visible = true;
      this.clearListParams();
    },
    cancel() {
      this.visible = false;
    },
    comfirm() {
      this.cancel();
    }
  }
};
</script>

<style scoped lang="less">
.tb_pagination {
  text-align: right;
}
</style>

