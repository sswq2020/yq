<template>
  <div class="container single-page">
    <HletongBreadcrumb :data="breadTitle"></HletongBreadcrumb>
    <div class="computedHeight">
      <div class="form">
        <el-form ref="form" :model="form" label-width="200px" size="small">
          <div class="form-block">
            <div class="head">公司信息</div>
            <el-row>
              <el-col :md="8" :sm="24" :xs="24">
                <el-form-item
                  label="所属公司"
                  prop="userId"
                  :rules="[{ required: true, message: '必须选择一个公司'}]"
                >
                  <companyglass @companySelect="_getCompanyInfo"></companyglass>
                  <el-input type="hidden" :value="form.userId" style="display:inline;height:0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="form.userId">
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="公司名称">{{form.name}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="统一社会信用代码">{{form.creditCode}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="公司地址">{{form.address}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="公司类型">{{form.entType_}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="法人">{{form.legalPersonName}}</el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item label="营业有效期">{{form.effectiveDt}} - {{form.expireDt}}</el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">加油加气信息</div>
            <el-row>
              <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
                <el-form-item
                  label="油气站照片(门头)"
                  prop="fileIdsLen"
                  :rules="validPic()"
                >
                  <div style="display:inline-block;" v-show="form.fileIdsLen">
                    <ImageBox :key="index" v-for="(item,index) in form.fileIds" :url="form.filepicUrlList[index]" :onDelete="()=>{uploadDelete(index)}"></ImageBox>
                  </div>
                  <div style="display:inline-block;" v-show="form.fileIdsLen< 3">
                    <ImageUpload  :onSuccess="(file)=>{uploadSuceess(file)}"></ImageUpload>
                  </div>                    
                  <el-input type="hidden" :value="form.fileIdsLen" style="display:inline;height:0"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="油气站名称:"
                    prop="gsName"
                    :rules="[{ required: true, message: '请输入油气站名称', trigger: 'blur' }]"
                  >
                    <el-input v-model="form.gsName" placeholder="请输入油气站名称"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="油气站电话:"
                    prop="gsPhone"
                    :rules="[{ required: true, message: '请输入油气站电话', trigger: 'blur' }]"
                  >
                    <el-input v-model="form.gsPhone" placeholder="请输入油气站电话"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="联系邮箱:"
                    prop="gsEmail"
                    :rules="[{ required: true, message: '请输入联系邮箱', trigger: 'blur' }]"
                  >
                    <el-input v-model="form.gsEmail" placeholder="请输入联系邮箱"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="油气站联系人:"
                    prop="gsContact"
                    :rules="[{ required: true, message: '请输入油气站联系人', trigger: 'blur' }]"
                  >
                    <el-input v-model="form.gsContact" placeholder="请输入油气站联系人"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="联系人手机:"
                    prop="contactPhone"
                    :rules="[{ required: true, message: '请输入油气站联系人', trigger: 'blur' }]"
                  >
                    <el-input v-model="form.contactPhone" placeholder="请输入油气站联系人"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="营业时间:"
                    prop="gsBusinessTime"
                    :rules="[{ required: true, message: '请输入营业时间', trigger: 'blur' }]"
                  >
                    <el-input v-model="form.gsBusinessTime" placeholder="请输入营业时间"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="特色服务:"
                    prop="gsFeatureService"
                    :rules="[{ required: true, message: '请选择特色服务', trigger: 'blur' }]"
                  >
                  <el-select multiple collapse-tags v-model="form.gsFeatureService" placeholder="请选择状态" size="small">
                    <el-option
                      v-for="item in featureServiceList"
                      :key="item.value"
                      :label="item.fsName"
                      :value="item.fsId"
                    ></el-option>
                  </el-select>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="油站位置:"
                    prop="gsAddress"
                  >
                  <AreaCascader 
                      :value="form.gsAddress" 
                      :clearable="true"
                      @selection="selectArea"/>
                  </el-form-item>
              </el-col>
              <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                  <el-form-item
                    label="详细地址:"
                    prop="gsDetailAddress"
                  >
                    <el-input v-model="form.gsDetailAddress" placeholder="请输入详细地址"></el-input>
                  </el-form-item>
              </el-col>            
            </el-row>
          </div>
          <div class="form-block">
            <div class="head">入会协议</div>
            <el-table :data="form.agreementList"  stripe border>
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
                  <span>{{form.agreementList[scope.$index][item.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="协议有效期" align="center">
                <template slot-scope="scope">
                  <span>{{form.agreementList[scope.$index].effectTimeText}}-{{form.agreementList[scope.$index].dueTimeText}}</span>
                </template>
              </el-table-column>
              <el-table-column label="协议图片" align="center">
                >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="form.agreementList&&form.agreementList.length"
                    @click="openImage(form.agreementList[scope.$index])"
                  >点击查看</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250px" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="editDeal(form.agreementList[scope.$index],scope.$index)"
                  >编辑</el-button>
                  <el-button type="text" @click="deleteDeal(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="uploadDeal" @click="addDeal">
              <i class="el-icon-plus"></i>上传协议
            </div>
          </div>
          <div class="form-block">
            <div class="head">油气品信息</div>
            <el-table :data="form.gasOilModelList"  stripe border>
              <el-table-column
                :prop="item.prop"
                :label="item.label"
                :width="item.width || 'auto'"
                :align="item.align || 'center'"
                header-align="center"
                :key="index"
                v-for="(item,index) in tableHeader_two"
              >
                <template slot-scope="scope">
                  <span>{{form.gasOilModelList[scope.$index][item.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250px" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="editOilGasInfoDeal(form.gasOilModelList[scope.$index],scope.$index)"
                  >编辑</el-button>
                  <el-button type="text" @click="deleteDeal(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="uploadDeal" @click="addOilGasInfoDeal">
              <i class="el-icon-plus"></i>新增油气品信息
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" size="small" :loading="loading" @click="submitForm">确定</el-button>
      <el-button size="small" @click="back">取消</el-button>
    </div>
    <agreedialog
      :cancleCb="()=>{this.setAgreeDialogVisible(false)}"
      :confirmCb="(agreeData)=>{_update_(agreeData)}"
    ></agreedialog>
    <oilGasInfodialog
      :OilModelList="ModelList"
      :cancleCb="()=>{this.setOilGasInfoDialogVisible(false)}"
      :confirmCb="(oilData)=>{_updateOilGasInfo_(oilData)}"
    ></oilGasInfodialog>
    <div class="images" style="display:none" v-viewer="{inline: false}">
      <img v-for="(src,index) in images" :src="src" :key="index" />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import { mapState, mapMutations, mapActions } from "vuex";
import Dict from "util/dict.js";
import {deleteProps} from 'util/util'
import AreaCascader from "components/areaCascader";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload";
import companyglass from "components/companyglass";
import agreedialog from "./agreedialog";
import oilGasInfodialog from "./oilGasInfodialog";
const defaulttableHeader = [
  {
    prop: "agreementName",
    label: "协议名称"
  },
  {
    prop: "contractCompany",
    label: "签约公司"
  }
];

const defaulttableHeader_two = [
  {
    prop: "oilModelName",
    label: "油气品分类"
  },
  {
    prop: "oilRetailPriceText",
    label: "挂牌零售价"
  },
  {
    prop: "oilChangeTypeText",
    label: "调价方式"
  },  
  {
    prop: "oilMemberAgioText",
    label: "会员折扣(%)"
  },
  {
    prop: "oilMemberDiscountText",
    label: "会员优惠(元)"
  },
  {
    prop: "oilMemberPriceText",
    label: "会员价"
  },  
];

const defualtFormParams = {
// region 公司信息
  userId: null, // 公司id
  name: null, // 公司名称
  creditCode: null, // 统一社会信用代码
  address: null, //公司地址
  entType_: null, //公司类型
  legalPersonName: null, // 法人
  effectiveDt: null, // 营业有效期开始
  expireDt: null, // 营业有效期结束
// endregion

// region 加油加气站信息信息
  gsName: null, // 加油站名称
	gsPhone: null, // 加油站电话
	gsContact: null, // 加油站联系人
	gsEmail: null, // 加油站邮箱
	gsQrCode: null, // 二维码fileId
	gsLongitude: null, // 加油站经度
	gsLatitude: null, // 加油站纬度
  contactPhone: null, // 联系人电话

  gsAddress:[], // 省市区选择器返回数组
	gsProvinceName: "", // 油站省名
	gsCityName: "", // 加油站市
	gsRegionName: "", // 加油站区名
	gsDetailAddress: "", // 加油站详细地址
	gsBusinessTime: "", // 营业开始时间
	isMemberOnline: "", // 是否开通e商茂通(1开通，0未开通)
  fileIds: [], //加油站图片fileId集合
  filepicUrlList:[], //加油站图片url集合
  fileIdsLen:0,

// endregion
  gsFeatureService:[], // 特色服务数据集合 提交时再改为gsFeatureServiceList
  gasOilModelList:[],// 油气类型集合
  agreementList: []
};

const Adapter = obj => {
  return Object.assign({}, obj, {
    effectTimeText: moment(obj.effectTime).format("YYYY-MM-DD"),
    dueTimeText: obj.dueTime ? moment(obj.dueTime).format("YYYY-MM-DD") : "长期"
  });
};

const AdapterOil = obj => {
  return Object.assign({}, obj, {
    oilRetailPriceText: `${obj.oilRetailPrice}元/${obj.oilUnit}`,
    oilMemberAgioText: `${obj.oilMemberAgio ? obj.oilMemberAgio : "/"}`,
    oilMemberDiscountText: `${obj.oilMemberDiscount ? obj.oilMemberDiscount : "/"}`,
    oilMemberPriceText: `${obj.oilMemberPrice}${obj.oilUnit}/元`,
    oilChangeTypeText: `${Dict.ADJUST_PRICE_TYPE[obj.oilChangeType]}`

  });
};

export default {
  name: "addGasStationForm",
  data() {
    return {
      loading: false,
      form: { ...defualtFormParams},
      tableHeader: defaulttableHeader,
      tableHeader_two:defaulttableHeader_two,
      /**新增的时候是-1,编辑的时候就是数组的序号 */
      editIndex: -1,
      images: [],
      featureServiceList:[],
      ModelList:[],
    };
  },
  components: {
    companyglass,
    agreedialog,
    oilGasInfodialog,
    ImageBox,
    ImageUpload,
    AreaCascader
  },
  computed: {
    ...mapState("gasStationForm", ["gsFormEdit", "gsId"]),
    breadTitle() {
      const EditText = this.gsFormEdit ? "编辑" : "新增";
      return ["会员管理", "油气站管理", `${EditText}油气站`];
    }
  },  
  methods: {
    ...mapMutations("agreement", [
      "setAgreeDialogVisible"
    ]),
    ...mapMutations("oilGasInfo", [
      "setOilGasInfoDialogVisible"
    ]),
    ...mapActions("agreement", [
      "openAddAgreeDialog",
      "openEditAgreeDialog",
    ]),
    ...mapActions("oilGasInfo", [
      "openAddOilGasInfoDialog",
      "openEditOilGasInfoDialog",
    ]),
    back() {
      this.$router.push({
        path: "/web/base/gas/page"
      });
    },
    _getCompanyInfo(obj) {
      const {userId,name,creditCode,legalPersonName,address,effectiveDt,expireDt,entType_
      } = obj;
      this.form = Object.assign({}, this.form, {userId,name,creditCode,legalPersonName,address,effectiveDt,expireDt,entType_
      });
    },
    /**打开编辑协议弹窗*/
    editDeal(item, index) {
      const { picUrlList } = item;
      this.editIndex = index;
      this.openEditAgreeDialog({ ...item, picLength: picUrlList.length });
    },
    /**删除协议*/
    deleteDeal(index) {
      this.form.agreementList.splice(index, 1);
    },
    /**打开新增协议弹窗*/
    addDeal() {
      this.editIndex = -1;
      this.openAddAgreeDialog();
    },
    /**打开编辑油品信息弹窗*/
    editOilGasInfoDeal(item, index){
      this.editIndex = index;
      this.openEditOilGasInfoDialog(item);
    },
    /**删除油品信息*/
    deleteOilGasInfoDeal(index) {
      // 以后还需要对OilModelList做处理
      this.form.gasOilModelList.splice(index, 1);
    },
    /**打开新增油品信息弹窗*/
    addOilGasInfoDeal(){
      this.editIndex = -1;
      this.openAddOilGasInfoDialog();
    },
    _update_(agreeData) {
      let that = this;
      if (this.editIndex > -1) {
        this.form.agreementList.splice(this.editIndex, 1, Adapter(agreeData)); // 不要直接使用array[index] = item,Vue无法观察数组的变化,必须用变异的函数,这也是弹窗里图片变化.使用了splice和push这种变异的方法
      } else {
        this.form.agreementList.push(Adapter(agreeData));
      }
      setTimeout(() => {
        that.setAgreeDialogVisible(false);
      }, 50);
    },
    _updateOilGasInfo_(oilData) {
      let that = this;
      if (this.editIndex > -1) {
        this.form.gasOilModelList.splice(this.editIndex, 1, AdapterOil(oilData)); // 不要直接使用array[index] = item,Vue无法观察数组的变化,必须用变异的函数,这也是弹窗里图片变化.使用了splice和push这种变异的方法
      } else {
        this.form.gasOilModelList.push(AdapterOil(oilData));
      }
      setTimeout(() => {
        that.setOilGasInfoDialogVisible(false);
      }, 50);
    },    
    _filter() {
      const group = _.groupBy(this.featureServiceList,'fsId')
      let params = _.cloneDeep(this.form);
      params.agreementList = params.agreementList.map(item => {
        return { ...item, userId: this.form.userId };
      });
      params.gsFeatureServiceList = params.gsFeatureService.map(item => {
        return group[item][0];
      })
      deleteProps(params,...['gsFeatureService','gsAddress','filepicUrlList','fileIdsLen'])
      return params;
    },
    /**
     * @author: xh
     * @description: 根据下拉选择的地址设置省市区
     */
    selectArea(value) {
      this.form.gsAddress = value;
      this.form.gsProvinceName = value[0] || '';
      this.form.gsCityName = value[1] || '';
      this.form.gsRegionName = value[2] || '';
    },
    /**特色服务List*/    
    async _getFeatureList(){
      const res = await this.$api.getFeatureList()
      switch (res.code) {
        case Dict.SUCCESS:
          this.featureServiceList = res.data.map(item=>{
            return {
              fsName:item.fsName,
              fsId:item.id,
              fsIcon:item.fsIcon
            }
          })
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }       
    }, 
    /**油气品分类List*/   
    async _getModelList() {
      const res = await this.$api.getModelList();
      switch (res.code) {
        case Dict.SUCCESS:
          this.ModelList = res.data.map(item => {
            return {
              label: item.oilModelName,
              value: item.id,
              oilUnit: item.oilUnit
            };
          });
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    submitForm() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          if (that.form.agreementList.length === 0) {
            that.$messageError("必须上传一个协议列表");
            return;
          }
          if (that.form.gasOilModelList.length === 0) {
            that.$messageError("必须上传一个油气品列表");
            return;
          }          
          const params = this._filter();
          this._addGAS_(params);
        } else {
          return false;
        }
      });
    },
    async _addGAS_(params) {
      this.loading = true;
      const res = await this.$api.AddGas(params);
      this.loading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("新增成功");
          this.back();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    validPic() {
      return [
        {
          required: true,
          message: "必上传"
        },
        {
          validator(rule, value, callback) {
            if (value === 0 || value > 3) {
              callback(new Error("至少上传一张,最多三张"));
            }
            callback();
          }
        }
      ];
    },
    uploadSuceess(res){
      this.form.fileIds.push(res.data.id)
      this.form.filepicUrlList.push(res.data.url);
      this.form.fileIdsLen = this.form.fileIds.length;      
    },
    uploadDelete(index){
      this.form.fileIds.splice(index,1)
      this.form.filepicUrlList.splice(index,1); 
      this.form.fileIdsLen = this.form.fileIds.length;       
    },
    openImage(item) {
      this.images = item.picUrlList;
      setTimeout(() => {
        const viewer = this.$el.querySelector(".images").$viewer;
        viewer.show();
      }, 500);
    },
    // 修改table header的背景色
    // tableHeaderColor({ rowIndex }) {
    //   if (rowIndex === 0) {
    //     return "background-color: #F6F8FA;color: #262626;font-weight: 500;";
    //   }
    // }
  },
  created(){
    this._getFeatureList().then(()=>{
      this._getModelList()
    })
  }
};
</script>

<style scoped lang="less">
.computedHeight {
  // height: calc(100% + 70px);
  // overflow: auto;
  .form {
    .form-block {
      padding: 20px;
      .head {
        margin-bottom: 20px;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #333333;
        background: #f6f8fa;
      }
      .uploadDeal {
        margin-top: 10px;
        font-size: 12px;
        color: #909399;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border: 1px dashed #eee;
        &:hover {
          color: #ff0000;
          cursor: pointer;
        }
    }
    }
  }
}

.bottom {
  // position: fixed;
  width: 86%;
  bottom: 20px;
  height: 50px;
  background-color: #f6f8fa;
  margin-left: 20px;
  box-shadow: 0 -1px 4px 0 hsla(0, 0%, 80%, 0.5);
  .el-button {
    min-width: 64px;
    margin-left: 20px;
    margin-top: 10px;
    &:last-child{
      margin-left: 16px;
    }
  }
}

</style>

    