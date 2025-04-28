<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState" style='width: 100px;'>
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="base-table">

      <el-table :data="applyList" stripe>
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :formatter="item.formatter" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="buttom" size="small" @click="handleDetail(scope.row)" v-if="
              scope.row.curAuditUserName == userInfo.userName && [1, 2].includes(scope.row.applyState)
            ">
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="pager.total" class="pagination"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>

    <el-dialog title="审核" width="50%" v-model="showDetailModal" destroy-on-close>
      <el-form ref="dialogForm" :model='auditForm' label-width="120px" label-suffix=":" :rules="rules">
        <el-form-item label="申请人">
          <div>{{ detail.applyUser.userName }}</div>
        </el-form-item>
        <el-form-item label="休假类型">
          <div>{{ detail.applyTypeName }}</div>
        </el-form-item>
        <el-form-item label="休假时间">
          <div>{{ detail.time }}</div>
        </el-form-item>
        <el-form-item label="休假时长">
          <div>{{ detail.leaveTime }}</div>
        </el-form-item>
        <el-form-item label="休假原因">
          <div>{{ detail.reasons }}</div>
        </el-form-item>
        <el-form-item label="审批状态">
          <div>{{ detail.applyStateName }}</div>
        </el-form-item>
        <el-form-item label="审批人">
          <div>{{ detail.curAuditUserName }}</div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :row="3" placeholder="请输入审核备注" v-model="auditForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleApprove('pass')">审核通过</el-button>
          <el-button @click="handleApprove('refuse')" type="primary">驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, toRaw } from 'vue'
import { ElMessage } from "element-plus";
import api from '../api';
import util from '../utils/util';
import store from '../store';
// 这个ctx就是vue2的this
// 获取Composition API 上下文对象
const { ctx } = getCurrentInstance();
const queryForm = reactive({
  applyState: 1
})
const leaveForm = reactive({
  applyType: 1,
  startTime: "",
  endTime: "",
  leaveTime: '2天',
  reasons: ''
})
const auditForm = reactive({
  remark: ''
})
const applyList = ref([])
const showDetailModal = ref(false)
const userInfo = store.state.userInfo
const detail = ref({})
const pager = reactive({
  pageNum: 1,
  pageSize: 20,
  total: 0
})
// 定义动态表格-格式

const columns = reactive([
  {
    label: "单号",
    prop: "orderNo",
  },
  {
    label: "申请人",
    prop: "applyUser",
    formatter(row) {
      return row.applyUser.userName
    }
  },
  {
    label: "休假时间",
    prop: "",
    formatter(row) {
      return (
        util.formateDate(new Date(row.startTime), "yyyy-MM-dd") +
        "到" +
        util.formateDate(new Date(row.endTime), "yyyy-MM-dd")
      );
    },
  },
  {
    label: "休假时长",
    prop: "leaveTime",
  },
  {
    label: "休假类型",
    prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value];
    },
  },
  {
    label: "休假原因",
    prop: "reasons",
  },
  {
    label: "申请时间",
    prop: "createTime",
    width: 180,
    formatter: (row, column, value) => {
      return util.formateDate(new Date(value));
    },
  },
  {
    label: "审批人",
    prop: "auditUsers",
  },
  {
    label: "当前审批人",
    prop: "curAuditUserName",
  },
  {
    label: "审批状态",
    prop: "applyState",
    formatter: (row, column, value) => {
      // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废          
      return {
        1: "待审批",
        2: "审批中",
        3: "审批拒绝",
        4: "审批通过",
        5: "作废",
      }[value];
    },
  },
]);
const rules = {
  remark: [
    {
      required: true,
      message: "请输入备注",
      trigger: ["change", "blur"],
    },
  ],
};
//  初始化接口调用
onMounted(() => {
  getApplyList()
})
// 获取休假申请列表
const getApplyList = async () => {
  let params = { ...queryForm, ...pager, type: 'approve', applyState: queryForm.applyState }
  let { list, page } = await api.getApplyList(params)
  applyList.value = list
  pager.total = page.total
}

// 分页器点击
const handleCurrentChange = (current) => {
  pager.pageNum = current
  getApplyList()
}
// 重置查询表单
const handleReset = (form) => {
  if (ctx.$refs[form])
    ctx.$refs[form].resetFields()
}
// 关闭弹窗
const handleClose = () => {
  showDetailModal.value = false
  handleReset('dialogForm')
}

const handleDetail = (row) => {
  console.log('row', row)
  let data = { ...row }
  data.applyTypeName = {
    1: "事假",
    2: "调休",
    3: "年假",
  }[data.applyType]
  data.time =
    util.formateDate(new Date(data.startTime), "yyyy-MM-dd") +
    "到" +
    util.formateDate(new Date(data.endTime), "yyyy-MM-dd");
  // 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废      
  data.applyStateName = {
    1: "待审批",
    2: "审批中",
    3: "审批拒绝",
    4: "审批通过",
    5: "作废",
  }[data.applyState];
  detail.value = data;
  showDetailModal.value = true;
}
const handleApprove = (action) => {
  ctx.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      let params = {
        action,
        remark: auditForm.remark,
        _id: detail.value._id,
      };
      try {
        await api.leaveApprove(params);
        handleClose();
        store.commit('saveNoticeCount', store.state.noticeCount - 1)
        ElMessage.success("处理成功");
        getApplyList();
      } catch (error) { }
    }
  });
};
</script>

<style lang="scss">
.select {
  width: 300px;
}
</style>