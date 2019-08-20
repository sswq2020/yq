<template>
  <div class="imgBox">
    <div class="img" :style="{ backgroundImage: `url(${url})`, backgroundSize: bs }">
      <div class="marker" v-if="hasPreview || hasDelete">
        <div class="tools" v-if="hasPreview || hasDelete">
            <i class="el-icon-view" v-if="hasPreview" @click.stop="open"></i>
            <i class="el-icon-delete" v-if="hasDelete" @click.stop="onDelete"></i>
        </div>
      </div>
    </div>
    <PreviewImage ref="previewimage" :dialogImageUrl="url"></PreviewImage>
  </div>
</template>

<script>
import PreviewImage from './PreviewImage'
const backgroundSizeEnumerate = ["cover", "contain"];
export default {
  props: {
    url: {
      type: String,
      default() {
        return null;
      }
    },
    backgroundSize: {
      default: "cover"
    },
    hasPreview: {
      type: Boolean,
      default: true    
    },
    hasDelete:{
      type: Boolean,
      default: true  
    },
    onDelete:{
      type: Function,
      default: ()=>{}  
    }
  },
  components:{
    PreviewImage
  },
  data() {
    return {
      bs: backgroundSizeEnumerate[0],
      dialogVisible:false,
    };
  },
  methods:{
    open(){
      this.$refs.previewimage.open()
    },
  }
};
</script>

<style  scoped lang="less">
.imgBox {
  width: 90px;
  height: 90px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 85%);
  position: relative;
  .img {
    width: 100%;
    height: 100%;
    background: center no-repeat;
  }
  .marker {
    transition: background-color 0.3s;
    background-color: rgba(0, 0, 0, 0);
    position: absolute;
    left: 8px;
    top: 8px;
    bottom: 8px;
    right: 8px;
  }

  .tools {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;
    height: 0;
    overflow: hidden;
    line-height: 20px;
    text-align: center;
    color: rgba(255, 255, 255, 0);
    font-size: 16px;
    transition: color 0.3s;
    i {
      margin: 0 4px;
    }
  }
  &:hover .marker {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &:hover .tools {
    height: 20px;
    color: rgba(255, 255, 255, 1);
    display: block;
  }
}
</style>
