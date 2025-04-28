<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" style="width: 250px;">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table :data="menuList" row-key="_id" :tree-props="{ children: 'children' }">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button @click="handleAdd(2, scope.row)" type="primary" size="mini">新增</el-button>
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="用户新增" v-model="showModal">
      <el-form :model="menuForm" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader v-model="menuForm.parentId" :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }" clearable></el-cascader>
          <span>不选则默认创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">异常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue';
import api from '../api';
import util from '../utils/util'
import { ElMessage } from 'element-plus';
const queryForm = ref({
  menuName: '',
  menuState: 1
})
const menuList = ref([])
const columns = ref([
  {
    label: "菜单名称",
    prop: "menuName",
    width: 150,
  },
  {
    label: "图标",
    prop: "icon",
  },
  {
    label: "菜单类型",
    prop: "menuType",
    formatter(row, column, value) {
      return {
        1: "菜单",
        2: "按钮",
      }[value];
    },
  },
  {
    label: "权限标识",
    prop: "menuCode",
  },
  {
    label: "路由地址",
    prop: "path",
  },
  {
    label: "组件路径",
    prop: "component",
  },
  {
    label: "菜单状态",
    prop: "menuState",
    width: 90,
    formatter(row, column, value) {
      return {
        1: "正常",
        2: "停用",
      }[value];
    },
  },
  {
    label: "创建时间",
    prop: "createTime",
    formatter(row, column, value) {
      return util.formateDate(new Date(value));
    },
  },
])
const showModal = ref(false)
const menuForm = ref({
  parentId: [null],
  menuType: 1,
  menuState: 1
})
let action = ''
const rules = ref({
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 10,
      message: '长度在2-10个字符',
      trigger: 'blur'
    }
  ]
})
const { ctx } = getCurrentInstance();
onMounted(() => {
  getMenuList()
})
// 菜单列表初始化
const getMenuList = async () => {
  try {
    let list = await api.getMenuList(queryForm.value);
    // let list = await api.getPermissionList()
    menuList.value = list;
    // menuList.value = list;
  } catch (e) {
    throw new Error(e);
  }
}
// 新增菜单
const handleAdd = (type, row) => {
  showModal.value = true
  action = 'add'
  if (type === 2) {
    menuForm.value.parentId = [...row.parentId, row._id].filter((item) => item)
    // console.log(menuForm.parentId)
  }
}
// 菜单编辑
const handleEdit = (row) => {
  showModal.value = true
  action = 'edit'
  nextTick(() => {
    Object.assign(menuForm.value, row)
  })
}
// 菜单删除
const handleDel = (_id) => {
  // 难度在服务端 前端只需要把要删除的id传给后端就行 而后端不仅要删除这一条还要删除其他以这个为父Id的数据
  api.menuSubmit({ _id, action: 'delete' })
  ElMessage.success('删除成功')
  getMenuList()
}
// 表单重置
const handleReset = (form) => {
  ctx.$refs[form].resetFields()
}
// 弹窗关闭
const handleClose = (form) => {
  showModal.value = false
  handleReset('dialogForm')
  getMenuList()
}
// 菜单弹窗提交
const handleSubmit = () => {
  ctx.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...menuForm.value, action }
      let res = await api.menuSubmit(params)
      showModal.value = false
      ElMessage.success('操作成功')
      handleReset('dialogForm')
      getMenuList()
    }
  })
}
</script>
<style></style>