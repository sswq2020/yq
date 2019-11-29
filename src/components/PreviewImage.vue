<template>
    <div class="previewImages" style="display:none" v-viewer="{inline: false}">
      <img v-for="(src,index) in images" :src="src" :key="index" />
    </div>
</template>

<script>
export default {
  name: "PreviewImage",
  props: {
    images: {
      type: Array,
      default: ()=>[]
    }
  },
  methods:{
      open(){
        setTimeout(() => {
          const viewer = this.$el.$viewer;
          viewer.show();
        }, 50);
      }
  }
};
</script>

<style>
</style>


