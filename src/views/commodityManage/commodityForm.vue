<template>
  <div class="container single-page">
    <hlBreadcrumb :data="breadTitle"></hlBreadcrumb>
    <div class="form">
      <el-form ref="form" :model="form" label-width="200px" size="small">
        <div class="form-block">
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <div class="head">商品信息</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="一级目录"
                prop="firstCatalogId"
                :rules="[{ required: true, message: '必选'  }]"
              >
                <el-select v-model="form.firstCatalogId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in firstClassList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="二级目录"
                prop="secondCatalogId"
                :rules="[{ required: true, message:'必选'  }]"
              >
                <el-select v-model="form.secondCatalogId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in secondClassList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="排放标准"
                prop="emissionStandard"
                :rules="[{ required: true, message: '必选' }]"
              >
                <el-select v-model="form.emissionStandard" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in HywEmissionStandardList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="密度(kg/m³)"
                prop="density"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="form.density"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="产品编号"
                prop="serialNumber"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="form.serialNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="生产商"
                prop="manufacturerId"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-select v-model="form.manufacturerId" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in HywManufacturerList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="产地"
                prop="addressProvince"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-select v-model="form.addressProvince" placeholder="请选择" size="small">
                  <el-option
                    v-for="(item,index) in ProvinceDataList"
                    :key="index"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="商品价格(元/吨)"
                prop="price"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="form.price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="库存(吨)"
                prop="totalWeightInventory"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-input v-model="form.totalWeightInventory"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="上传图片"
                prop="fileId"
                :rules="[{ required: true, message: '请正确上传图片' }]"
              >
                <div class="imgBox" v-show="form.fileId">
                  <ImageBox :url="url" :onDelete="uploadDelete"></ImageBox>
                </div>
                <div class="imgBox" v-show="!(form.fileId)">
                  <ImageUpload :onSuccess="(file)=>{this.uploadSuceess(file)}"></ImageUpload>
                  <div
                    style="display:inline-block;vertical-align:text-bottom;font-size:12px;color:#333;margin-left:10px;"
                  >尺寸最大800*800。图片大小小于3M</div>
                </div>
                <el-input type="hidden" :value="form.fileId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block" v-show="form.parameterList.length">
          <div class="head">参数信息</div>
          <el-row :gutter="30">
            <el-col
              :md="12"
              :sm="12"
              :xs="24"
              v-for="(item, index) in form.parameterList"
              :key="item.id"
            >
              <el-form-item
                :label="item.paraName"
                :prop="'parameterList.' + index + '.paraValue'"
                :rules="{required: true, message: '必填', trigger: 'blur'}"
              >
                <el-input v-model="item.paraValue"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form-block">
          <div class="head">销售状态</div>
          <el-row :gutter="30">
            <el-col :md="12" :sm="12" :xs="24">
              <el-form-item
                label="销售状态"
                prop="sellState"
                :rules="[{ required: true, message: '必填' }]"
              >
                <el-radio
                  v-for="item in HywSellStateList"
                  :key="item.id"
                  v-model="form.sellState"
                  :label="item.id"
                >放入{{item.name}}</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="bottom">
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="submitForm('form')">发布</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { classMixin, dictMixin } from "@/common/mixin.js";
import hlBreadcrumb from "components/hl-breadcrumb";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload";
import Dict from "util/dict.js";
import areaData from "components/areaData.js";
import _ from "lodash";

const ProvinceDataList = areaData.map(item=>{
  return {
    name:item.value
  }
})

const defualtFormParams = {
  fileId: null, // 图片上传成功后返回的id
  firstCatalogId: null,
  secondCatalogId: null,
  emissionStandard: null,
  density: null,
  serialNumber: null,
  manufacturerId: null,
  addressProvince:null,
  price: null,
  totalWeightInventory: null,
  sellState: "1",
  parameterList: []
};

export default {
  name: "commodityForm",
  mixins: [classMixin, dictMixin],
  components: {
    hlBreadcrumb,
    ImageBox,
    ImageUpload
  },
  data() {
    return {
      loading: false,
      url: "#", // 后台改成上传成功后返回的url
      form: { ...defualtFormParams },
      paramsList: [],
      /**参数列表一般是由一二级目录决定，但是编辑页面一开始进入的时候是唯一的外部触发*/
      ExternalTrigger: false,
      reservaSecondClassId: null,
      ProvinceDataList:ProvinceDataList
    };
  },
  computed: {
    ...mapState("releaseNewCommodity", ["isEdit", "commodityId"]),
    breadTitle() {
      return this.isEdit
        ? ["商品管理", "编辑商品"]
        : ["商品管理", "发布新商品"];
    }
  },
  methods: {
    ...mapMutations("releaseNewCommodity", ["setIsEdit", "setCommodityId"]),
    back() {
      this.$router.push({
        path: "/web/hyw/product/product/deploy"
      });
    },
    GoOnSale() {
      this.$router.push({
        path: "/web/hyw/product/product/pageOnSale"
      });
    },
    GoForSale() {
      this.$router.push({
        path: "/web/hyw/product/product/pageForSale"
      });
    },
    async _addCommodity_(params) {
      this.loading = true;
      const res = await this.$api.addCommodity(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("新增商品成功");
          if (this.form.sellState === "0") {
            this.GoOnSale();
          } else {
            this.GoForSale();
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _updateCommodity_(params) {
      this.loading = true;
      const res = await this.$api.updateCommodity(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("编辑商品成功");
          if (this.form.sellState === "0") {
            this.GoOnSale();
          } else {
            this.GoForSale();
          }
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    _findName(arr = [], id) {
      let copy = _.clone(arr);
      const index = _.findIndex(copy, o => {
        return o.id == id;
      });
      if (index > -1) {
        return copy[index].name;
      } else {
        return null;
      }
    },
    _filter() {
      const params = _.clone(
        Object.assign(
          {},
          this.form,
          {
            firstCatalogName: this._findName(
              this.firstClassList,
              this.form.firstCatalogId
            )
          },
          {
            secondCatalogName: this._findName(
              this.secondClassList,
              this.form.secondCatalogId
            )
          },
          { url: this.url },
          {
            sellStateEnum: null,
            emissionStandardEnum: null
          }
        )
      );
      return params;
    },
    uploadSuceess(res) {
      this.url = res.data.url;
      this.form.fileId = res.data.id;
    },
    uploadDelete() {
      this.url = "#";
      this.form.fileId = null;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = this._filter();
          if (this.isEdit) {
            this._updateCommodity_(params);
          } else {
            this._addCommodity_(params);
          }
        } else {
          return false;
        }
      });
    },
    async _getParameter(id) {
      const res = await this.$api.getParameterById(id);
      switch (res.code) {
        case Dict.SUCCESS:
          this.paramsList = _.cloneDeep(res.data); // 万一以后有用
          this.form.parameterList = res.data.map(item => {
            return { ...item, paraValue: "" };
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getDetailCommodity(id) {
      const res = await this.$api.getDetailCommodity({ id });
      switch (res.code) {
        case Dict.SUCCESS:
          this.reservaSecondClassId = _.cloneDeep(res.data.secondCatalogId);
          this.form = { ...res.data, secondCatalogId: null };
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    async _getFilesInfo(fileId) {
      const res = await this.$api.getFilesInfo({ fileId });
      switch (res.code) {
        case Dict.SUCCESS:
          this.url = res.data.url;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    }
  },
  mounted() {
    if (this.isEdit && this.commodityId) {
      console.info("这是编辑页面");
      this.ExternalTrigger = true;
      this._getDetailCommodity(this.commodityId);
    } else {
      if (this.$route.name === "editOldCommodity") {
        this.back();
      }
      console.info("这是新增页面");
    }
  },
  created() {},
  beforeDestroy() {
    this.setIsEdit(false);
    this.setCommodityId(null);
  },
  watch: {
    "form.firstCatalogId": {
      handler(newV, oldV) {
        if (newV !== oldV) {
          if (newV) {
            const index = _.findIndex(this.firstClassList, o => {
              return o.id == newV;
            });
            this.secondClassList = this.firstClassList[index].children;
            if (this.ExternalTrigger) {
              this.form.secondCatalogId = this.reservaSecondClassId;
            } else {
              this.form.secondCatalogId = null;
            }
          }
        }
      }
    },
    "form.secondCatalogId": {
      handler(newV, oldV) {
        if (!newV) {
          setTimeout(() => {
            this.form.parameterList = [];
          }, 20);
          return;
        }
        if (this.ExternalTrigger) {
          this.ExternalTrigger = false;
          return;
        }
        if (newV !== oldV) {
          this._getParameter(newV);
        }
      }
    },
    "form.fileId": {
      handler(newV, oldV) {
        if (newV) {
          if (newV !== oldV && this.url === "#") {
            this._getFilesInfo(newV);
          }
        }
      }
    }
  }
};
</script>


<style scoped lang="less">
.form {
  padding: 30px 15px 50px 15px;
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 700;
    }
  }
}
</style>
