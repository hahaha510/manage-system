<template>
  <div class="user-manage">
    <div class="query-form">
      <query-form :form="form" v-model="user" @handleQuery="handleQuery"></query-form>
      <!-- <el-form :inline="true" :model="user" ref="formRef">
        <el-form-item label="用户ID" prop="userId">
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
        </el-form-item>
      </el-form> -->
    </div>
    <base-table :columns="column" :data="userList" stripe @selection-change="handleSelectionChange"
      @handleAction="handleAction" :pager="pager" @handleCurrentChange="handleCurrentChange">
      <template v-slot:action>
        <el-button type="primary" @click="handleCreate" v-has="'user-create'">新增</el-button>
        <el-button type="danger" @click="handlePatchDel" v-has="'user-patch-delete'">批量删除</el-button>
      </template>
    </base-table>
    <!-- <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate" v-has="'user-create'">新增</el-button>
        <el-button type="danger" @click="handlePatchDel" v-has="'user-patch-delete'">批量删除</el-button>
      </div>

      <el-table :data="userList" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in column" :prop="item.prop" :label="item.label" :width="item.width"
          :formatter="item.formatter" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="buttom" size="small" @click="handleEdit(scope.row)" v-has="'user-edit'">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handelDel(scope.row)" v-has="'user-delete'">删除</el-button>
          </template>
</el-table-column>
</el-table>
<el-pagination background layout="prev, pager, next" :total="pager.total" class="pagination" :page-size="pager.pageSize"
  @current-change="handleCurrentChange" />
</div> -->
    <el-dialog title="用户新增" v-model="showModal">
      <el-form :model="userForm" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名称" :disabled="action === 'edit'"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" :disabled="action === 'edit'">
            <template #append>@imooc.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state" placeholder="请选择在职状态">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select v-model="userForm.roleList" placeholder="请选择系统角色" multiple>
            <el-option v-for="role in roleList" :key="role._id" :label="role.roleName" :value="role._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader v-model="userForm.deptId" placeholder="请选择所属部门" :options="deptList"
            :props="{ checkSrtictly: true, value: '_id', label: 'deptName' }" clearable />
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
import { reactive, ref, onMounted, getCurrentInstance, toRaw } from 'vue'
import { ElMessage } from "element-plus";
import api from '../api';
import util from '../utils/util';
// 这个ctx就是vue2的this
// 获取Composition API 上下文对象
const { ctx } = getCurrentInstance();
const form = [
  {
    type: 'input',
    label: '用户ID',
    model: 'userId',
    placeholder: '请输入用户ID',
  },
  {
    type: 'input',
    label: '用户名称',
    model: 'userName',
    placeholder: '请输入用户名称',
    visible: true
  },
  {
    type: 'select',
    label: '状态',
    model: 'state',
    placeholder: '请选择状态',
    visible: true,
    options: [
      {
        label: '所有',
        value: 0
      },
      {
        label: '在职',
        value: 1
      },
      {
        label: '离职',
        value: 2
      },
      {
        label: '试用期',
        value: 3
      },
    ]
  }
]
// 初始化用户表单对象
const user = ref({
  state: 1
})
const formRef = ref(null)
// 初始化用户列表数据
const userList = ref([])
// 初始化分页对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10
})

// 定义动态表格-格式
const column = reactive([
  {
    type: 'selection'
  },
  {
    label: '用户ID',
    prop: 'userId'
  },
  {
    label: '用户名',
    prop: 'userName'
  },
  {
    label: '用户邮箱',
    prop: 'userEmail',
  },
  {
    label: '用户角色',
    prop: 'role',
    formatter: (row, column, value) => {

      return {
        0: "管理员",
        1: '普通用户'
      }[value]
    }
  },
  {
    label: '用户状态',
    prop: 'state',
    formatter: (row, column, value) => {
      return {
        1: "在职",
        2: "离职",
        3: '试用期'
      }[value]
    }
  },
  {
    label: '注册时间',
    prop: 'createTime',
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value))
    }
  },
  {
    label: '最后登录的时间',
    prop: 'lastLoginTime',
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value))
    }
  },
  {
    type: "action",
    label: '操作',
    width: 200,
    list: [
      {
        type: 'primary',
        size: 'small',
        text: '编辑',
        visible: true
      },
      {
        type: 'danger',
        text: '删除',
        visible: true
      }
    ]
  }
])
// 已选的数据id
const checkUserIds = ref([])
// 弹框显示对象
const showModal = ref(false)
// 新增用户Form对象
const userForm = reactive({
  state: 1
})
// 所有角色列表
const roleList = ref([])
// 所有部门列表
const deptList = ref([])
// 定义用户操作的行为
const action = ref('add')

// 定义表单校验规则
const rules = reactive({
  userName: [
    {
      required: true,
      message: '请输入用户名称',
      trigger: 'blur'
    }
  ],
  userEmail: [
    {
      required: true,
      message: '请输入用户邮箱',
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      pattern: /1\d{10}/,
      message: '请输入正确的手机号格式',
      trigger: 'blur'
    }
  ],
  deptId: [{
    required: true,
    message: '请输入部门ID',
    trigger: 'blur'
  }]
})
//  初始化接口调用
onMounted(() => {
  getUserList()
  getRoleAllList()
  getDeptList()
})
// 获取用户列表

const getUserList = async () => {
  const params = { ...user.value, ...pager }
  try {
    const { list, page } = await api.getUserList(params)
    userList.value = list
    pager.total = page.total
  } catch (error) {
  }
}
// 查询事件，获取用户列表
const handleQuery = (val) => {
  getUserList()
}
// 重置查询表单
const handleReset = (form) => {
  if (ctx.$refs[form])
    ctx.$refs[form].resetFields()
}
// 分页器当前页改变事件处理函数
const handleCurrentChange = (current) => {
  pager.pageNum = current
  getUserList()
}
// 用户单个删除
const handelDel = async (row) => {
  // console.log(row)
  await api.userDel({
    userIds: [row.userId]
  })
  ElMessage.success('删除成功')

  getUserList()
}
// 用户批量删除
const handlePatchDel = async () => {
  if (checkUserIds.value.length === 0) {
    ElMessage.error('请选择要删除的用户')
    return
  }
  const res = await api.userDel({
    userIds: checkUserIds.value
  })
  if (res.modifiedCount > 0) {
    ElMessage.success('删除成功')
    getUserList()
  } else {
    ElMessage.error('删除失败')
  }
}
// 表格table多选
const handleSelectionChange = (list) => {
  let arr = []
  list.map(item => {
    arr.push(item.userId)
  })
  checkUserIds.value = arr
}
const handleAction = ({ index, row }) => {
  if (index == 0) {
    handleEdit(row)
  } else if (index == 1) {
    handelDel(row)
  }
}
// 新增用户 
const handleCreate = () => {
  action.value = 'add'
  showModal.value = true

}
// 部门列表查询
const getDeptList = async () => {
  let list = await api.getDeptList()
  deptList.value = list
}
// 角色列表查询 用在弹窗里角色选择
const getRoleAllList = async () => {
  let list = await api.getRoleAllList();
  roleList.value = list
}
// 用户新增弹窗关闭
const handleClose = () => {
  showModal.value = false
  // 重置表单
  handleReset('dialogForm')
}
// 用户新增弹窗提交
const handleSubmit = () => {
  ctx.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      // 去掉响应式
      let params = toRaw(userForm)
      params.userEmail += "@imooc.com"
      params.action = action.value
      let res = await api.userSubmit(params)
      showModal.value = false
      ElMessage.success('用户创建成功')
      handleReset('dialogForm')
      getUserList()
    }
  })
}
// 用户编辑
const handleEdit = (row) => {
  action.value = 'edit'
  showModal.value = true
  ctx.$nextTick(() => {
    Object.assign(userForm, row)
  })
}
</script>

<style lang="scss">
.select {
  width: 300px;
}
</style>