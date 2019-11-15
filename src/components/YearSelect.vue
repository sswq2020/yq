<template>
  <el-select @change="yearListeners" :value="value" placeholder="请选择">
    <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "yearSelect",
  props: {
    before: {
      type: Number,
      default: 0
    },
    after: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: new Date().getFullYear()
    }
  },
  computed: {
    yearList() {
      const startYear = new Date().getFullYear() - this.before;
      let list = [];
      for (let i = 0; i < this.before + this.after + 1; i++) {
        const year = startYear + i;
        list.push({
          value: year,
          label: `${year}年`
        });
      }
      return list;
    }
  },
  methods: {
    yearListeners(value) {
      this.$emit("sendYear", value);
    }
  }
};
</script>

<style>
</style>