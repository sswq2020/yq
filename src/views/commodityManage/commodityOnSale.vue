<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle">
      <el-button
        type="primary"
        plain
        size="small"
        @click="GoReleaseNewCommodity"
        icon="el-icon-plus"
      >发布新商品</el-button>
      <el-button
        type="primary"
        plain
        size="small"
        @click="takenoff(null)"
        :disabled="!selectedItems.length"
        icon="el-icon-download"
      >下架</el-button>
    </hlBreadcrumb>
    <div class="search-box">
      <div class="form-item">
        <label>一级目录</label>
        <div class="form-control">
          <el-select v-model="form.firstCatalogId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in firstClassList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>二级目录</label>
        <div class="form-control">
          <el-select v-model="form.secondCatalogId" placeholder="请选择" size="small">
            <el-option
              v-for="(item,index) in secondClassList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-item">
        <label>商品编码</label>
        <div class="form-control">
          <el-input v-model="form.productNumber" placeholder="请输入内容" size="small"></el-input>
        </div>
      </div>
      <div class="form-item">
        <label>售价</label>
        <div class="form-control">
          <el-input v-model="form.startPrice" placeholder="最低价" size="small"></el-input>至
          <el-input v-model="form.endPrice" placeholder="最高价" size="small"></el-input>
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
      @pageChange="changePage"
      :total="listData.paginator.totalCount"
      :currentPage="listParams.page"
      :pageSize="listParams.pageSize"
      :pageSizes="[5]"
      :data="listData.list"
      :multiple="true"
      @selection-change="selectChange"
      :loading="isListDataLoading"
    >
      <el-table-column label="商品信息" width="500px">
        <template slot-scope="scope">
          <div class="goods">
            <div class="avatar">
             <img v-if="listData.list[scope.$index].picUrl"
                width="65"
                height="64"
                :src="listData.list[scope.$index].picUrl"
              />
              <span v-else>未设置图片</span>
            </div>
            <div class="goods-content">
              <div
                class="productName"
              >{{listData.list[scope.$index].firstCatalogName+listData.list[scope.$index].secondCatalogName+listData.list[scope.$index].emissionStandardEnum.text || '-'}}</div>
              <div class="serialNumber">商品编码:{{listData.list[scope.$index].serialNumber}}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="售价" width="200px">
        <template slot-scope="scope">
          <div class="price">
            {{listData.list[scope.$index].price}}
            <i
              @click="open(listData.list[scope.$index])"
              class="el-icon-edit"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="200px">
        <template slot-scope="scope">
          <div class="price">
            {{listData.list[scope.$index].totalWeightInventory}}
            <i
              @click="open(listData.list[scope.$index])"
              class="el-icon-edit"
            ></i>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :align="item.align || 'center'"
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

      <el-table-column label="操作" width="250px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="GoEditOldCommodity(listData.list[scope.$index])">编辑商品</el-button>
          <el-button type="text" @click="takenoff(listData.list[scope.$index])">下架</el-button>
        </template>
      </el-table-column>
    </heltable>
    <pricedialog
      :title="editProductName"
      :priceLoading="priceLoading"
      :confirmCb="(data)=>{this.updatePrice(data)}"
    ></pricedialog>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import { classMixin } from "@/common/mixin.js";
import _ from "lodash";
// import { judgeAuth } from "@/util/util.js";
import Dict from "@/util/dict.js";
import heltable from "@/components/hl_table";
import hlBreadcrumb from "@/components/hl-breadcrumb";
import pricedialog from "./pricedialog.vue";
import { number3 } from "util/validate.js";

const defaultFormData = {
  firstCatalogId: null,
  secondCatalogId: null,
  productNumber: null,
  startPrice: null,
  endPrice: null
};
const defaultListParams = {
  pageSize: 5,
  page: 1,
  sellState: "0"
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
    prop: "volumeWeightSold",
    label: "总销量",
    align: "right"
  },
  {
    prop: "createdTime",
    label: "发布时间"
  }
];

export default {
  name: "commodityOnSale",
  mixins: [classMixin],
  components: {
    heltable,
    hlBreadcrumb,
    pricedialog
  },
  data() {
    return {
      breadTitle: ["商品管理", "出售中的商品"],
      isListDataLoading: false,
      listParams: { ...defaultListParams }, // 页数
      form: { ...defaultFormData }, // 查询参数
      listData: { ...defaultListData }, // 返回list的数据结构
      tableHeader: defaulttableHeader,
      showOverflowTooltip: true,
      selectedItems: [],
      editProductName: "编辑修改",
      priceLoading: false
    };
  },
  computed: {
    /**请求参数估计只要id*/
    ids() {
      return this.selectedItems.map(item => {
        return item.id;
      });
    },
    serialNumbers() {
      return this.selectedItems.map(item => {
        return item.serialNumber;
      });
    }
  },
  methods: {
    ...mapMutations("releaseNewCommodity", ["setIsEdit", "setCommodityId"]),
    ...mapMutations("commodityOnSale", ["setPricedialog"]),
    ...mapActions("commodityOnSale", ["openPriceDialog"]),
    selectChange(selection) {
      this.selectedItems = selection.slice();
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
    getListDataBylistParams() {
      this.listParams = { ...defaultListParams };
      this.getListData();
    },
    _filter() {
      const { startPrice, endPrice } = this.form;
      if (!startPrice && !endPrice) {
        return true;
      }
      if (!startPrice && endPrice) {
        this.$messageError("最低价应填");
        return false;
      }
      if (startPrice && !endPrice) {
        this.$messageError("最高价应填");
        return false;
      }
      if (number3(startPrice) && number3(endPrice)) {
        if (Number(endPrice) >= Number(startPrice)) {
          return true;
        } else {
          this.$messageError("最高价必须大于或等于最低价");
          return false;
        }
      } else {
        this.$messageError("价格必须是正数可以包含3位小数");
        return false;
      }
    },
    async getListData() {
      const flag= this._filter();
      if(!flag) return;
      this.isListDataLoading = true;
      const res = await this.$api.getCommodityOnSaleList({
        ...this.form,
        ...this.listParams
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
    open(item) {
      const { id, price, totalWeightInventory, firstCatalogName,secondCatalogName,emissionStandardEnum, serialNumber } = item;
      this.editProductName = `编辑商品${firstCatalogName+secondCatalogName+emissionStandardEnum.text},编码为${serialNumber}`;
      this.openPriceDialog({ id, price, totalWeightInventory });
    },
    GoReleaseNewCommodity() {
      this.$router.push({
        path: "/web/hyw/product/product/deploy"
      });
    },
    GoEditOldCommodity(item) {
      const { id } = item;
      this.setIsEdit(true);
      this.setCommodityId(id);
      this.$router.push({
        path: "/web/hyw/product/product/update"
      });
    },
    takenoff(item = null) {
      let that = this;
      let params, serialNumber, info,url;
      if (item) {
        params = {'id':item.id,'sellState':"1"}
        serialNumber = item.serialNumber;
        url = 'updateCommodity'
      } else {
        params = this.ids.map((item)=>{return {'id':item,'sellState':"1"}});
        serialNumber = this.serialNumbers.join();
        url = 'batchUpdateCommodity'
      }
      info = `商品编码${serialNumber}`;
      this.$confirm(`确定要下架${info}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await that.$api[url](params);
        switch (res.code) {
          case Dict.SUCCESS:
            that.$messageSuccess(`下架成功`);
            that.getListData();
            break;
          default:
            that.$messageError(`下架成功,${res.mesg}`);
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
    async updatePrice(data) {
      this.priceLoading = true;
      const res = await this.$api.updateCommodity(data);
      this.priceLoading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess(`修改成功`);
          this.setPricedialog(false);
          this.getListData();
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
  },
  watch: {
    "form.firstCatalogId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.form.secondCatalogId = null;
          if (newV) {
            const index = _.findIndex(this.firstClassList, o => {
              return o.id == newV;
            });
            this.secondClassList = this.firstClassList[index].children;
          }
        }
      }
    }
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

.goods {
  position: relative;
  padding: 9px 10px 11px 15px;
  font-size: 0px;
  .avatar {
    display: inline-block;
    vertical-align: top;
    img {
      border-radius: 2px;
    }
  }
  .goods-content {
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
