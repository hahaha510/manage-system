<template>
  <h1>欢迎来到欢迎页</h1>
  <el-button @click="goLogin">跳转到登录页</el-button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped></style>