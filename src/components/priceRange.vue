<template>
  <div class="el-date-editor el-range-editor el-input__inner el-date-editor--daterange" style="height:32px;line-height:32px">
    <input style="font-size:13px" v-on="lowListeners" v-bind="$attrs" v-bind:value="low" placeholder="最低价"  class="el-range-input" />
    <span class="el-range-separator" style="line-height:24px">-</span>
    <input style="font-size:13px" v-on="highListeners" v-bind="$attrs" v-bind:value="high" placeholder="最高价"  class="el-range-input" />
  </div>
</template>

<script>
export default {
  name: 'priceRange',
  props: {
    low: {
      type: [String,Number],
      default: ''
    },
    high:{
      type: [String,Number],
      default: ''        
    }
  },
  computed: {
    lowListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('lowest', event.target.value)
          }
        }
      )
    },
    highListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('highest', event.target.value)
          }
        }
      )
    },    
  },


  methods: {

  }
}
</script>