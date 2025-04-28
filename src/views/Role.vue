<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleOpenPermission(scope.row)" type='primary' size="mini">设置权限</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="pager.total" class="pagination"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="角色新增" v-model="showModal">
      <el-form :model="roleForm" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="roleForm.remark" :row="2" type="textarea" placeholder="请输入备注"></el-input>
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

    <el-dialog title="权限设置" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree ref="permissionRef" :data="menuList" show-checkbox default-expand-all node-key="_id"
            :props="{ label: 'menuName' }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">
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
  roleName: "",
})
const roleList = ref([])
const roleForm = ref({})
const columns = ref([
  {
    label: "角色名称",
    prop: "roleName",
  },
  {
    label: "备注",
    prop: "remark",
  },
  {
    label: "权限列表",
    prop: "permissionList",
    width: 200,
    formatter(row, column, value) {
      let names = []
      let list = value.halfCheckedKeys || []
      list.map((key) => {
        let name = actionMap.value[key]
        if (key && name) names.push(actionMap.value[key])
      })
      return names.join(',')
    }
  },
  {
    label: "更新时间",
    prop: "updateTime",
    formatter(row, column, value) {
      return util.formateDate(new Date(value));
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
const pager = ref({
  total: 0,
  pageNum: 1,
  pageSize: 10
})
const rules = ref({
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur'
    }
  ]
})
const showModal = ref(false)
let action = 'create'
// 权限展示的数据
const showPermission = ref(false)
let curRoleId = ''
let curRoleName = ''
const menuList = ref([])
// 菜单映射表
const actionMap = ref({})
const { ctx } = getCurrentInstance();
onMounted(() => {
  getRoleList()
  getMenuList()
})
// 分页器切换
const handleCurrentChange = async (current) => {
  pager.value.pageNum = current
  getRoleList()
}
// 获取角色列表
const getRoleList = async () => {
  try {
    let { list, page } = await api.getRoleList({ ...queryForm.value, ...pager.value });
    roleList.value = list;
    pager.value.total = page.total
    // menuList.value = list;
  } catch (e) {
    throw new Error(e);
  }
}
// 获取菜单权限列表
const getMenuList = async () => {
  try {
    let list = await api.getMenuList();
    menuList.value = list;
    getActionMap(menuList.value)
  } catch (e) {
    throw new Error(e);
  }
}
// 表单重置
const handleReset = (form) => {
  ctx.$refs[form].resetFields()
}
// 弹窗关闭
const handleClose = () => {
  handleReset('dialogForm')
  showModal.value = false
}
// 角色添加
const handleAdd = () => {
  action = 'create'
  showModal.value = true
}
// 角色编辑
const handleEdit = (row) => {
  action = 'edit'
  nextTick(() => {
    roleForm.value = { _id: row._id, roleName: row.roleName, remark: row.remark }
  })
  showModal.value = true
}
// 角色删除
const handleDel = async (_id) => {
  await api.roleOperate({ _id, action: 'delete' })
  ElMessage.success('删除成功')
  getRoleList()
}
// 角色提交
const handleSubmit = () => {
  ctx.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = { ...roleForm.value, action }
      let res = await api.roleOperate(params)
      if (res) {
        showModal.value = false
        ElMessage.success('创建成功')
        handleReset('dialogForm')
        getRoleList()
      }
    }
  })
}
// 展示权限菜单
const handleOpenPermission = (row) => {
  curRoleName = row.roleName
  curRoleId = row._id
  showPermission.value = true
  let { checkedKeys } = row.permissionList
  setTimeout(() => {
    ctx.$refs.permissionRef.setCheckedKeys(checkedKeys)
  })
}
// 权限表单提交
const handlePermissionSubmit = async () => {
  // 得到全选中的节点 就是打钩的 半选中就是横线那个
  let nodes = ctx.$refs.permissionRef.getCheckedNodes()
  //得到半选中的节点的id
  let halfKeys = ctx.$refs.permissionRef.getHalfCheckedKeys()
  // 只要最下面的那个 就是没有children了 其它的都给他算作半选中
  let checkedKeys = []
  let parentKeys = []
  nodes.map((node) => {
    if (!node.children) {
      checkedKeys.push(node._id)
    } else {
      parentKeys.push(node._id)
    }
  })
  let params = {
    _id: curRoleId,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: parentKeys.concat(halfKeys)
    }
  }
  await api.updatePermission(params)
  showPermission.value = false
  ElMessage.success('设置成功')
  getRoleList()
}
// 获取菜单映射表
const getActionMap = (list) => {
  let map = {}
  const deep = (arr) => {
    while (arr.length) {
      let item = arr.pop()
      if (item.children && item.action) {
        map[item._id] = item.menuName
      }
      if (item.children && !item.action) {
        deep(item.children)
      }
    }

  }
  // 因为这个list是一个引入类型 我们传入的是menuList 而这个函数又对list进行pop了
  // 导致数据全丢失了  所以我们要用JSON序列化一下 弄一个新的对象 
  deep(JSON.parse(JSON.stringify(list)))
  actionMap.value = map
}
</script>
<style></style>