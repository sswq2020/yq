<template>
  <el-input-number class="input-number" :value="value" @change="change" controls-position="right" :precision="precision" :min="min" :max="max" :placeholder="placeholder"></el-input-number>
</template>

<script>
export default {
  name: "inputNumber",
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Number,
    precision: {
      type: Number,
      default: 2
    },
    placeholder: {
       type: String,
      default: '请输入'
    },
    min: Number,
    max: Number
  },
  methods: {
    change(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less">
.input-number {
  width: 100%;
  span {
    display: none
  }
  .el-input__inner {
    text-align: left;
  }
}
</style>


