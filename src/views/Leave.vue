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
      <div class="action">
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>

      <el-table :data="applyList" stripe>
        <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label" :width="item.width"
          :formatter="item.formatter" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="buttom" size="small" @click="handleDetail(scope.row)">
              查看
            </el-button>
            <el-button type="danger" size="small" @click="handelDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :total="pager.total" class="pagination"
        :page-size="pager.pageSize" @current-change="handleCurrentChange" />
    </div>
    <el-dialog title="申请休假" v-model="showModal" width="70%">
      <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules="rules">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="10">
              <el-form-item prop="startTime" required>
                <el-date-picker v-model="leaveForm.startTime" type="date" placeholder="选择开始日期"
                  @change="(val) => handleDateChange('startTime', val)" />
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align :  center;">-</el-col>
            <el-col :span="10">
              <el-form-item prop="endTime" required>
                <el-date-picker v-model="leaveForm.endTime" type="date" placeholder="选择结束日期"
                  @change="(val) => handleDateChange('endTime', val)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input type="textarea" :row="3" laceholder="请输入休假原因" v-model="leaveForm.reasons" />
        </el-form-item>
        <el-form-item label="文件上传">
          <input type="file" @change="handleUpload">
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal" destroy-on-close>
      <el-steps :active="detail.applyState > 2 ? 3 : detail.applyState" align-center>
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
      </el-form>
    </el-dialog>
  </div>

</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, toRaw } from 'vue'
import { ElMessage } from "element-plus";
import api from '../api';
import util from '../utils/util';
import SparkMD5 from 'spark-md5';
import { da } from 'element-plus/es/locales.mjs';
// 这个ctx就是vue2的this
// 获取Composition API 上下文对象
const { ctx } = getCurrentInstance();
const queryForm = reactive({
  applyState: ''
})
const showModal = ref(false)
const leaveForm = reactive({
  applyType: 1,
  startTime: "",
  endTime: "",
  leaveTime: '2天',
  reasons: ''
})
const applyList = ref([])
const action = ref('create')
const showDetailModal = ref(false)
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
  startTime: [
    {
      type: "date",
      required: true,
      message: "请输入开始日期",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      required: true,
      message: "请输入结束日期",
      trigger: "change",
    },
  ],
  reasons: [
    {
      required: true,
      message: "请输入休假原因",
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
  let params = { ...queryForm, ...pager }
  let { list, page } = await api.getApplyList(params)
  applyList.value = list
  pager.total = page.total
}
// 申请休假按钮
const handleApply = () => {
  showModal.value = true
  action.value = 'create'

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
  showModal.value = false
  handleReset('dialogForm')
}
// 提交表单
const handleSubmit = () => {
  ctx.$refs.dialogForm.validate(async (valid) => {
    if (valid) {
      try {
        let params = { ...leaveForm, action: action.value };
        let res = await api.leaveOperate(params);
        ElMessage.success("创建成功");
        handleClose();
        getApplyList();
      } catch (error) { }
    }
  });
}
const handleDateChange = (key, val) => {
  let { startTime, endTime } = leaveForm
  if (!startTime || !endTime) return
  if (startTime > endTime) {
    ElMessage.error('开始日期不能晚于结束日期')
    leaveForm.leaveTime = '0天'
    setTimeout(() => {
      leaveForm[key] = ''
    }, 0)
  } else {
    leaveForm.leaveTime = ((endTime - startTime) / (24 * 60 * 60 * 1000) + 1) + "天"
  }
}
const handleDetail = (row) => {
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
const handelDelete = (_id) => {
  try {
    let params = { _id, action: 'delete' }
    let res = api.leaveOperate(params)
    ElMessage.success('删除成功')
    getApplyList()
  } catch (error) {

  }
}

//大文件上传的实现
const CHUNK_SIZE = 1024 * 1024
const fileHash = ref('')
const fileName = ref('')
// 文件分片
const createChunks = (file) => {
  let cur = 0;
  let chunks = []
  while (cur < file.size) {
    const blob = file.slice(cur, cur + CHUNK_SIZE)
    chunks.push(blob)
    cur = cur + CHUNK_SIZE
  }
  return chunks
}

const calculateHash = (chunks) => {
  return new Promise(resolve => {
    // 1.对每一个文件第一个和最后一个切片全部参与计算
    // 2.中间的切片只计算前面两个字节、中间两个字节和最后两个字节
    const targets = []
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    chunks.forEach((chunk, index) => {
      if (index === 0 || index === chunks.length - 1) {
        targets.push(chunk)
      } else {
        targets.push(chunk.slice(0, 2))
        targets.push(chunk.slice(CHUNK_SIZE / 2, CHUNK_SIZE / 2 + 2))
        targets.push(chunk.slice(CHUNK_SIZE - 2, CHUNK_SIZE))
      }
    })
    fileReader.readAsArrayBuffer(new Blob(targets))
    fileReader.onload = (e) => {
      // 将数据追加到 SparkMD5 实例中
      spark.append(e.target.result)
      // 计算并输出 MD5 哈希值
      const md5Hash = spark.end();
      resolve(md5Hash)
    }
  })
}

const uploadChunks = async (chunks, existChunks) => {
  const data = chunks.map((chunk, index) => {
    return {
      fileHash: fileHash.value,
      chunkHash: fileHash.value + '-' + index,
      chunk
    }
  })
  const formDatas = data.filter((item) => !existChunks.includes(item.chunkHash))
    .map((item) => {
      const formData = new FormData()
      formData.append('fileHash', item.fileHash)
      formData.append('chunkHash', item.chunkHash)
      formData.append('chunk', item.chunk)
      return formData
    })
  const max = 6
  let index = 0
  const taskPool = []

  while (index < formDatas.length) {
    // let params = { formDate: formDatas[index] }
    const task = api.leaveUpload(formDatas[index])
    task.then(() => {
      taskPool.splice(taskPool.findIndex((item) => item === task))
    })
    taskPool.push(task)
    if (taskPool.length === max) {
      await Promise.race(taskPool)
    }
    index++
  }
  await Promise.all(taskPool)
}

const mergeRequest = async () => {
  try {
    const params =
      { fileHash: fileHash.value, fileName: fileName.value, size: CHUNK_SIZE }
    await api.leaveMerge(params)
    ElMessage.success('合并成功')
  } catch (error) {
    ElMessage.error('合并失败')
  }
}
const handleUpload = async (e) => {
  // 1.读取文件
  // console.log(e.target.files)
  const files = e.target.files
  if (!files) return
  fileName.value = files[0].name
  // 2.文件分片
  const chunks = createChunks(files[0])
  // console.log(chunks)

  // 3.计算hash值
  const hash = await calculateHash(chunks)
  fileHash.value = hash
  // console.log(hash)
  let params = { fileHash: fileHash.value, fileName: fileName.value }
  let { shouldUpload, existChunks } = await api.leaveVerify(params)
  if (!shouldUpload) {
    ElMessage.success('秒传成功')
    return
  } else {
    // 4.文件分片上传
    await uploadChunks(chunks, existChunks)

    // 5.合并文件
    await mergeRequest()
  }

}
</script>

<style lang="scss">
.select {
  width: 300px;
}
</style>