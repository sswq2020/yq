<template>
  <span style="color:red">{{countdown}}</span>
</template>

<script>
import moment from "moment";
import { tow } from "util/util";
export default {
  name: "countdown",
  props: {
    endTime: {
      type: [String,Number],
      default: moment().format("YYYY/MM/DD HH:mm:ss")
    }
  },
  data() {
    return {
      timer: null,
      countdown:null
    };
  },
  methods: {
    getDate() {
      clearTimeout(this.timer);
      let oDate = new Date(); //获取日期对象
      let oldTime = oDate.getTime(); //现在距离1970年的毫秒数
      let newDate = new Date(Number(this.endTime));
      let newTime = newDate.getTime(); //2019年距离1970年的毫秒数
      let second = Math.floor((newTime - oldTime) / 1000); //未来时间距离现在的秒数
      let day = Math.floor(second / 86400); //整数部分代表的是天；一天有24*60*60=86400秒 ；
      second = second % 86400; //余数代表剩下的秒数；
      let hour = Math.floor(second / 3600); //整数部分代表小时；
      second %= 3600; //余数代表 剩下的秒数；
      let minute = Math.floor(second / 60);
      second %= 60;
      this.countdown =`支付倒计时: ${tow(day)}天${tow(hour)}小时${tow(minute)}分钟${tow(second)}秒`
      if(day < 0 || hour < 0 || minute < 0 || second < 0) {
        this.countdown = '超时'
        return;
      }

      if (day === 0 && hour === 0 && minute === 0 && second === 0) {
      this.countdown = '超时' 
        return;
      }
      this.timer = setTimeout(this.getDate, 1000);
    }
  },
  mounted() {
      this.getDate()
  },
  watch:{
    endTime(newV,oldV){
      if(newV && newV!=oldV){
        this.timer = null;
      }
    }
  }
};
</script>