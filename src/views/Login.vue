<template>
  <div class="login-wrapper">
    <div class="modal">
      <!-- rules写校验规则  status-icon校验的状态图标 :model="user"跟user数据绑定 下面才能绑定到user.userName等-->
      <el-form :model="user" ref="userFomeRef" status-icon :rules="rules">
        <div class="title">登录</div>
        <!-- prop="userName"表明我要校验的变量 不写校验不会生效 -->
        <el-form-item prop="userName">
          <el-input type="text" :prefix-icon="User" v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="passward" :prefix-icon="View" v-model="user.userPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { User, View } from '@element-plus/icons-vue';
import { ref } from 'vue';
import router from '../router';
import api from '../api';
import store from '../store/index'
import mutations from '../store/mutations'
let user = ref({
  userName: '',
  userPwd: ''
})
let rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: "blur" },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  userPwd: [
    { required: true, message: '请输入密码', trigger: "blur" },
    { min: 6, max: 11, message: 'Length should be 3 to 5', trigger: 'blur' },
  ]
})
let userFomeRef = ref(null)
const { saveUserInf } = mutations
const login = () => {
  userFomeRef.value.validate((valid) => {
    if (valid) {
      api.login(user.value).then((res) => {
        store.commit('saveUserInfo', res)
        router.push('/welcome')
      })
    } else {
      return false
    }
  })
}

// export default {

//   // mounted() {
//   //   // this.$request({
//   //   //   method: 'get',
//   //   //   url: '/login'
//   //   // }).then((res) => {
//   //   //   console.log(res)
//   //   // })
//   //   this.$request.get('/login', { name: "jack" }).then((res) => {
//   //     console.log(res)
//   //   })
//   // }
// }
</script>

<style lang="scss">
.login-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: f9fcff;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 4px #c7c9cb4d;

    .title {
      font-size: 50px;
      text-align: center;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>