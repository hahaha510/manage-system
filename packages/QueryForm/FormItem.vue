<template>
  <el-form-item :prop="item.model">
    <el-input v-if="item.type == 'input'" v-bind="$attrs"></el-input>
    <el-select v-else-if="item.type === 'select'" style="width: 100px;" v-bind="$attrs">
      <el-option v-for="option in item.options" :key="option.value" v-bind="option">
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script>
export default {
  name: "QueryForm",
  props: ['item'],
  setup() {

  }
}
</script>