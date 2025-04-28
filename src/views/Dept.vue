<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" ref="queryFormRef" :model="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList" type="primary">查询</el-button>
          <el-button @click="handleReset('queryFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id" :tree-props="{ children: 'children' }" stripe>
        <el-table-column v-for="item in columns" v-bind="item"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="action == 'create' ? '创建部门' : '编辑部门'" v-model="showModal">
      <el-form ref="dialogFormRef" :model="deptForm" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader placeholder="请选择上级部门" v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable :options="deptList"
            :show-all-levels="true"></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="user">
          <el-select placeholder="请选择部门负责人" v-model="deptForm.user" @change="handleUser">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input placeholder="请输入负责人邮箱" v-model="deptForm.userEmail" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { getCurrentInstance, nextTick, onMounted, ref } from 'vue'
import api from '../api'
import { ElMessage } from 'element-plus'

const { ctx } = getCurrentInstance()
const queryForm = ref({
  deptName: ''
})
const deptList = ref([])
const columns = ref([
  {
    label: "部门名称",
    prop: "deptName",
  },
  {
    label: "负责人",
    prop: "userName",
  },
  {
    label: "更新时间",
    prop: "updateTime",
  },
  {
    label: "创建时间",
    prop: "createTime",
  },
])
const pager = ref({
  pageNum: 1,
  pageSize: 10
})
const rules = ref({
  parentId: [
    {
      required: true,
      message: "请选择上级部门",
      trigger: "blur",
    },
  ],
  deptName: [
    {
      required: true,
      message: "请输入部门名称",
      trigger: "blur",
    },
  ],
  user: [
    {
      required: true,
      message: "请选择负责人",
      trigger: "blur",
    },
  ],
})
const deptForm = ref({
  parentId: [null]
})
let action = ''
const showModal = ref(false)
const userList = ref([])
onMounted(() => {
  getDeptList()
  getAllUserList()
})

// 方法
const getAllUserList = async () => {
  userList.value = await api.getAllUserList()
}
const handleUser = (val) => {
  console.log('val=>', val)
  const [userId, userName, userEmail] = val.split('/')
  Object.assign(deptForm.value, { userId, userName, userEmail })
}
const getDeptList = async () => {
  deptList.value = await api.getDeptList({ ...queryForm.value, ...pager.value })
}
const handleReset = (form) => {
  ctx.$refs[form].resetFields()
}

const handleOpen = () => {
  action = 'create'
  showModal.value = true

}
const handleEdit = (row) => {
  action = 'edit'
  showModal.value = true
  nextTick(() => {
    Object.assign(deptForm.value, row, {
      user: `${row.userId}/${row.userName}/${row.userEmail}`
    })
  })
}
const handleDel = async (_id) => {
  action = 'delete'
  await api.deptOperate({ _id, action: action })
  ElMessage.success('删除成功')
  getDeptList()
}
const handleClose = () => {
  showModal.value = false
  handleReset("dialogFormRef")
}
const handleSubmit = () => {
  ctx.$refs.dialogFormRef.validate(async (valid) => {
    if (valid) {
      let params = { ...deptForm.value, action: action }
      delete params.user
      await api.deptOperate(params)
      ElMessage.success('操作成功')
      handleClose()
      getDeptList()
    }
  })
}
</script>