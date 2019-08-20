<template>
  <div class="companyglass">
    <el-input placeholder="请选择公司" :readonly="true">
      <el-button slot="append" icon="el-icon-search" @click="open"></el-button>
    </el-input>
    <el-dialog
      title="公司"
      width="1200px"
      :visible.sync="visible"
      :center="true"
      @close="cancel"
      :close-on-click-modal="false"
    >
      <div class="search-box">
        <div class="form-item">
          <label>公司名称</label>
          <div class="form-control">
            <el-input v-model="form.name" placeholder="请输入" size="small"></el-input>
          </div>
        </div>
        <div class="form-item">
          <label>业务联系人</label>
          <div class="form-control">
            <el-input v-model="form.bizName" placeholder="请输入" size="small"></el-input>
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
  </div>
</template>
<script>
import Dict from "util/dict.js";
const defaultFormData = {
  name: null,
  bizName: null
};

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
    prop: "name",
    label: "公司名称",
    width: "250"
  },
  {
    prop: "creditCode",
    label: "统一社会信用代码",
    width: "150"
  },
  {
    prop: "legalPersonName",
    label: "法人姓名",
    width: "120"
  },
  {
    prop: "bizName",
    label: "业务联系人名称",
    width: "120"
  },
  {
    prop: "address",
    label: "公司地址"
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
        name: row.extInfo.name, // 企业名称
        creditCode: row.extInfo.creditCode, // 统一社会信用代码
        legalPersonName: row.extInfo.legalPersonName, // 法人姓名
        bizName: row.extInfo.bizName, //业务联系人名称
        bizIdNo: row.extInfo.bizIdNo, //业务联系人身份证号
        address: row.extInfo.address, // 地址
        effectiveDt: row.extInfo.effectiveDt, // 营业生效日期
        expireDt: row.extInfo.expireDt, // 营业到期日期
        userId: row.extInfo.userId, // 公司id
        entType_:row.extInfo.entType_ // 企业类型
      });
    });
  }
  return list;
};

export default {
  name: "companyglass",
  props: {},
  data() {
    return {
      visible: false,
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: [...defaultAuditResultTableHeader],
      currentRow:null //选中的那一行数据
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
      const res = await this.$api.getEnterpriseList({
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
    comfirm() {
      if(!this.currentRow) {
        this.$messageError("必须选中一行才能确认");
        return
      }
      this.$emit('companySelect',this.currentRow);
      this.cancel();
    },
    handleCurrentChange(row) {
      this.currentRow = row;
    }
  },
  watch: {
    visible(newV, oldV) {
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
  margin-bottom: 10px;
  padding: 0px 20px;
  background-color: white;
  font-size: 14px;
  .form-item {
    .el-button {
      margin-top: 36px;
    }
  }
}
.tb_pagination {
  text-align: right;
}
</style>

