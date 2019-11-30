<template>
    <div class="areaCascader" :style="computedStyleWidth"   v-if="Areadata.length>0">
        <el-cascader change-on-select
                  :options="Areadata"
                  @change="handleChange"
                  placeholder="请选择省市区"
                  :value="value"
                  size="small"
                  :disabled="disabled"
                  :clearable="clearable"
                  :props="{ checkStrictly: false }">
        </el-cascader>
    </div>
</template>

<script>
    import defaultData from "./areaData.js";
    export default {
        name: "areaCascader",
        props: {
            value: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            clearable: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: "100%"
            }
        },
        data () {
            return {
                Areadata: []
            };
        },
        methods: {
            handleChange(value) {
                // console.log(value);
                this.$emit('selection',value)
            }
        },
        computed: {
            computedStyleWidth () {
                return `width:${this.width}`;
            }
        },
        // components: {
        //     Cascader
        // },
        mounted () {
            // 模拟异步请求，便于之后从后端获取数据
            let this_ = this;
            setTimeout(() => {
                this_.Areadata = defaultData;
            }, 100);
        }
    };
</script>
