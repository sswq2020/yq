<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="tabs">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="待付款" name="unpay"></el-tab-pane>
        <el-tab-pane label="已付款" name="payed"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="search-box">
      <div class="form-item">
        <label>订单号</label>
        <div class="form-control">
          <el-input v-model="form.orderCode" placeholder="请输入内容" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>商品编码</label>
        <div class="form-control">
          <el-input v-model="form.orderStatus" placeholder="请输入内容" size="small"></el-input>
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
    <div v-if="activeName=='unpay'">
      <heltable
        ref="tb"
        @pageChange="changePage"
        :total="listData.paginator.totalCount"
        :currentPage="listParams.page"
        :pageSize="listParams.pageSize"
        :pageSizes="[5]"
        :data="listData.list"
        :serialize="serialize"
        :stripe="stripe"
        :border="border"
        :loading="isListDataLoading"
      >
        <el-table-column label="商品信息" width="500px">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info">{{listData.list[scope.$index].orderTime}}</span>
                <span class="header-info">订单号:{{listData.list[scope.$index].orderCode}}</span>
              </div>
              <div class="info">
                <div class="avatar">
                  <img v-if="listData.list[scope.$index].picUrl"
                  width="65"
                  height="64"
                  :src="listData.list[scope.$index].picUrl"
                  />
                  <span v-else>未设置图片</span>
                </div>
                <div class="product-content">
                  <div class="productName">{{listData.list[scope.$index].firstCatalogName+listData.list[scope.$index].secondCatalogName+listData.list[scope.$index].emissionStandard}}</div>
                  <div class="serialNumber">商品编码:{{listData.list[scope.$index].serialNumber}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="price">{{listData.list[scope.$index].productPrice}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="price">{{listData.list[scope.$index].productWeight ? parseInt(listData.list[scope.$index].productWeight) : "-" }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="买家">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo" style="justify-content: center;">
                <div class="center">
                  <div>{{listData.list[scope.$index].buyerTel}}</div>
                  <div style="color:#3c8bff;text-align:center">查看明细</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="price">{{listData.list[scope.$index].productTotal}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="250px" align="center">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info" v-if="listData.list[scope.$index].isInvalid === '0' ">
                  <countdown :endTime="listData.list[scope.$index].exTime"></countdown>
                </span>
                <span class="header-info" v-else style="color:red">超时</span>
              </div>
              <div class="otherinfo" style="justify-content: center;">
                <div class="center">
                  <div>{{listData.list[scope.$index].statusText}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </heltable>
    </div>
    <div v-if="activeName=='payed'">
      <heltable
        ref="tb"
        @pageChange="changePage"
        :total="listData.paginator.totalCount"
        :currentPage="listParams.page"
        :pageSize="listParams.pageSize"
        :pageSizes="[5]"
        :data="listData.list"
        :serialize="serialize"
        :stripe="stripe"
        :border="border"
        :loading="isListDataLoading"
      >
        <el-table-column label="商品信息" width="500px">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info">{{listData.list[scope.$index].orderTime}}</span>
                <span class="header-info">订单号:{{listData.list[scope.$index].orderCode}}</span>
              </div>
              <div class="info">
                <div class="avatar">
                  <img v-if="listData.list[scope.$index].picUrl"
                  width="65"
                  height="64"
                  :src="listData.list[scope.$index].picUrl"
                  />
                  <span v-else>未设置图片</span>
                </div>
                <div class="product-content">
                  <div class="productName">{{listData.list[scope.$index].firstCatalogName+listData.list[scope.$index].secondCatalogName+listData.list[scope.$index].emissionStandard}}</div>
                  <div class="serialNumber">商品编码:{{listData.list[scope.$index].serialNumber}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="price">{{listData.list[scope.$index].productPrice}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="price">{{listData.list[scope.$index].productWeight ? parseInt(listData.list[scope.$index].productWeight) : "-" }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="买家">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="center">
                  <div>{{listData.list[scope.$index].buyerTel}}</div>
                  <div style="color:#3c8bff;text-align:center">查看明细</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo">
                <div class="price">{{listData.list[scope.$index].productTotal}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="250px" align="center">
          <template slot-scope="scope">
            <div class="goods">
              <div class="header">
                <span class="header-info"></span>
              </div>
              <div class="otherinfo" style="justify-content: center;">
                <div class="center">
                  <div>{{listData.list[scope.$index].statusText}}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </heltable>
    </div>
  </div>
</template>

<script>
import hlBreadcrumb from "components/hl-breadcrumb";
import heltable from "components/hl_table";
import countdown from "components/countdown";
import Dict from "@/util/dict.js";
const defaultFormData = {
  orderCode: null,
  serialNumber: null
};
const defaultListParams = {
  pageSize: 5,
  page: 1,
};
const defaultListData = {
  paginator: {
    totalCount: 0,
    totalPage: 1
  },
  list: []
};

export default {
  name: "orderManage",
  components: {
    heltable,
    hlBreadcrumb,
    countdown
  },
  data() {
    return {
      breadTitle: ["商品管理", "订单管理"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      activeName: "unpay",
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      serialize: false,
      border: false,
      stripe: false
    };
  },
  computed: {},
  methods: {
    changePage(page) {
      this.listParams.page = page;
      this.getListData();
    },
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    clearListParams() {
      this.form = { ...defaultFormData };
      this.listParams = { ...defaultListParams };
      this.listData = { ...defaultListData };
      this.getListData();
    },
    async getListData() {
      this.isListDataLoading = true;
      const res = await this.$api.orderCommodityManage({
        ...this.form,
        ...this.listParams,
        orderStatus: this.activeName === 'unpay' ? Dict.PAY_AWAIT : Dict.PAY_RECEIVED
      });
      this.isListDataLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.listData = res.data;
          break;
        default:
          this.listData = { ...defaultListData };
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
  },
  watch: {
    activeName: {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.clearListParams()
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.tabs {
  background-color: white;
  //   height: 30px;
  //   line-height: 30px;
  // padding: 0 15px;
  font-size: 14px;
}

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

.goods {
  position: relative;
  font-size: 0px;

  .header {
    height: 30px;
    line-height: 29px;
    box-sizing: border-box;
    padding: 0px 10px 0px 15px;
    border-bottom: 1px solid #eaedf1;
    .header-info {
      font-size: 12px;
      color: #333;
      margin-right: 10px;
    }
  }
  .info {
    box-sizing: border-box;
    margin: 10px 10px 0px 15px;
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        border-radius: 2px;
      }
    }
    .product-content {
      display: inline-block;
      vertical-align: top;
      margin-left: 15px;
      height: 76px;
      .productName {
        font-size: 12px;
        color: #3c8bff;
      }
      .serialNumber {
        font-size: 12px;
        color: #333;
      }
    }
  }
  .otherinfo {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 86px;
    font-size: 12px;
    box-sizing: border-box;
  }
}

.price {
  text-align: center;
}

.el-icon-edit {
  padding: 5px;
  font-size: 16px;
  color: #3c8bff;
  &:hover {
    color: rgb(255, 83, 60);
    cursor: pointer;
  }
}
</style>
