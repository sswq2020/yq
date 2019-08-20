<template>
  <el-button @click="doPrint">打印</el-button>
</template>

<script>
export default {
  name: 'printBtn',
  props: {
    contentId: {
      type: String,
      default: ''
    },
  },
  methods: {
    doPrint() {
      let el = document.getElementById(this.contentId).cloneNode(true);
      let wind = window.open('','print');
      let linkList = window.parent.document.getElementsByTagName('style');
      for(let i = 0; i < linkList.length;i++){
          let tag = document.createElement('style');
          tag.type='text/css';
          tag.innerText= linkList[i].innerText.replace(/\r?\n|\r/g, "");
          wind.document.head.appendChild(tag);
      }
      wind.document.body.appendChild(el);
      setTimeout(()=>{
          wind.print();
      },1000)
      if(navigator.userAgent.indexOf('MSIE') > 0) {
          wind.document.body.removeChild(el);
      }
    },
  }
}
</script>
