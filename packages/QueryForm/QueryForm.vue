<template>
  <el-form :inline="true" :model="queryModel" ref="queryForm">
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-model="queryModel[item.model]" v-bind="item" />
    </template>
    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>

    <!-- <el-form-item label="用户ID" prop="userId">
      <el-input v-model='user.userId' placeholder="请输入用户ID"></el-input>
    </el-form-item>
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model='user.userName' placeholder="请输入用户名称"></el-input>
    </el-form-item>
    <el-form-item class="select" label="用户状态" prop="state">
      <el-select v-model="user.state" placeholder="请选择状态">
        <el-option :value="0" label="所有"></el-option>
        <el-option :value="1" label="在职"></el-option>
        <el-option :value="2" label="离职"></el-option>
        <el-option :value="3" label="试用期"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleQuery" v-has="'user-query'">查询</el-button>
      <el-button @click="handleReset('formRef')">重置</el-button>
    </el-form-item> -->
  </el-form>
</template>
<script>
/**
 * form=[
 * {
 * type:"input",
 * model:'userId',
 * label:'用户Id'
 * placeholder:'请输入用户名称'
 * }
 * ]
 * 
 */
import { getCurrentInstance, reactive } from 'vue';
import FormItem from './FormItem.vue';
export default {
  name: 'QueryForm',
  props: ['modelValue', 'form'],
  emits: ['update:modelValue', "handleQuery"],
  components: { FormItem },
  setup(props, context) {
    const ctx = getCurrentInstance()
    const form = props.form
    const queryModel = reactive({
      ...props.modelValue
    })
    const handleReset = () => {
      ctx.refs.queryForm.resetFields()
    }
    const handleQuery = () => {
      context.emit('update:modelValue', { ...queryModel })
      context.emit('handleQuery', { ...queryModel })
    }
    return {
      queryModel,
      handleReset,
      handleQuery
    }
  }
}

</script>