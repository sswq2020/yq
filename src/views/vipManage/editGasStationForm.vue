<template>
  <div class="memberForm">
    <el-form ref="form" :model="form" label-width="150px" size="small">
      <div class="form-block">
        <div class="head">油气站信息</div>
        <el-row>
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <el-form-item label="油气站照片(门头)" prop="fileIdsLen" :rules="validPic()">
              <div style="display:inline-block;" v-show="form.fileIdsLen">
                <ImageBox
                  :key="index"
                  v-for="(item,index) in form.fileUrls"
                  :url="item"
                  :onDelete="()=>{uploadDelete(index)}"
                ></ImageBox>
              </div>
              <div style="display:inline-block;" v-show="form.fileIdsLen < 3">
                <ImageUpload :onSuccess="(file)=>{uploadSuceess(file)}"></ImageUpload>
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
              <el-select
                style="width:100%"
                multiple
                collapse-tags
                v-model="form.gsFeatureService"
                placeholder="请选择状态"
                size="small"
              >
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
            <el-form-item label="油站位置:" prop="gsAddress">
              <AreaCascader :value="form.gsAddress" :clearable="true" @selection="selectArea" />
            </el-form-item>
          </el-col>
          <el-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
            <el-form-item label="详细地址:" prop="gsDetailAddress">
              <el-input v-model="form.gsDetailAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="footer">
      <el-button type="primary" size="small" @click="submitForm" :loading="viploading">
        <span>确定</span>
      </el-button>
      <el-button @click="GoMember" size="small">
        <span>取消</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import Dict from "util/dict.js";
import {deleteProps} from 'util/util'
import AreaCascader from "components/areaCascader";
import ImageBox from "components/ImageBox";
import ImageUpload from "components/ImageUpload";

const defualtFormParams = {
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
  fileUrls:[], //加油站图片url集合
  fileIdsLen:0,

// endregion
  gsFeatureService:[], // 特色服务数据集合 提交时再改为gsFeatureServiceList
};

const AdapterOil = obj => {
  const params =  Object.assign({}, obj, {
    fileIds:obj.fileIds.slice(),
    fileUrls:obj.fileUrls.slice() ,
    fileIdsLen:obj.fileIds.length,
    gsFeatureService:obj.gsFeatureServiceList.map(item=>item.fsId),
    gsAddress:[obj.gsProvinceName || "",obj.gsCityName || "",obj.gsRegionName || "" ]
  });
  return params
};


export default {
  name: "editGasStationForm",
  data() {
    return {
      form: { ...defualtFormParams },
      featureServiceList:[],
      viploading: false,
    };
  },
  components: {
    AreaCascader,
    ImageBox,
    ImageUpload
  },
  methods: {
    GoMember() {
      this.$emit("gasStationClose");
    },
    _filter() {
      const group = _.groupBy(this.featureServiceList,'fsId')
      let params = _.cloneDeep(this.form);
      params.gsFeatureServiceList = params.gsFeatureService.map(item => {
        return group[item][0];
      })
      deleteProps(params,...['gsFeatureService','gsAddress','fileUrls','fileIdsLen'])
      return params;
    },    
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = this._filter();
          this._UpdateGas_(
            Object.assign({}, params)
          );
        } else {
          return false;
        }
      });
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
      this.form.fileUrls.push(res.data.url);
      this.form.fileIdsLen = this.form.fileIds.length;      
    },
    uploadDelete(index){
      this.form.fileIds.splice(index,1)
      this.form.fileUrls.splice(index,1); 
      this.form.fileIdsLen = this.form.fileIds.length;       
    },    
    /**根据下拉选择的地址设置省市区*/
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
    /**更新油气站*/  
    async _UpdateGas_(params) {
      this.viploading = true;
      const res = await this.$api.UpdateGas(params);
      this.viploading = false;
      switch (res.code) {
        case Dict.SUCCESS:
          this.$messageSuccess("更新油气站成功");
          this.GoMember();
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }
    },
    /**查询油气站详情*/ 
    async _getGasStationDetail(gsId){
      const res = await this.$api.queryGasStationDetail({gsId});
      switch (res.code) {
        case Dict.SUCCESS:
          this.form = AdapterOil(res.data)
          this.form.fileIds = res.data.fileIds;
          this.form.fileUrls = res.data.fileUrls;
          this.form.fileIdsLen = res.data.fileIds.length;
          break;
        default:
          this.$messageError(res.mesg);
          break;
      }      
    }
  },
  computed: {
    ...mapState("gasStationForm", ["gsId","gsFormEdit"]),
    ...mapState("memberForm", ["memberId"]),
  },
  mounted() {
    if (!this.gsId || !this.gsFormEdit) {
      this.GoMember();
      return;
    }
    this._getGasStationDetail(this.gsId).then(()=>{
      this._getFeatureList();
    })
  }
};
</script>

<style lang="less" scoped>
.memberForm {
  margin: 15px 20px 50px 20px;
  background: white;
  .el-table thead {
    color: #909399;
    font-weight: 500;
    background: #eee;
  }
  .form-block {
    padding-bottom: 20px;
    .head {
      margin-bottom: 20px;
      box-sizing: border-box;
      height: 45px;
      line-height: 45px;
      border-bottom: 1px solid #e1e1e2;
      padding-left: 20px;
      font-size: 14px;
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 130px;
  right: 20px;
  z-index: 100;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 hsla(0, 0%, 80%, 0.5);
}
</style>

