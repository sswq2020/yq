<template>
  <div class="block" >
    <el-image :width="width" :height= "height" :src="url" :fit="fit" :preview-src-list="previewList"></el-image>
  </div>
</template>

<script>
export default {
    name:"elImage",
    props:{
        url:{
            type:String,
            default:"#"
        },
        fit:{
            type:String,
            default:"fill"
        },
        previewList:{
            type:Array,
            default:()=>[]
        },
        width:{
            type:String,
            default:"100px"
        },
        height:{
            type:String,
            default:"100px"
        }
    },
}
</script>

