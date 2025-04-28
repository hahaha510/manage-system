<template>
  <div class="exception">
    <img src="@/assets/images/404.png" alt="">
    <el-button @click="toHome" class="btn-home">回首页</el-button>
  </div>
</template>
<script setup>
import router from '../router';
const toHome = () => {
  router.push('/')
}
</script>
<style lang="scss">
.exception {
  img {
    width: 100vw;
    height: 100vh;
  }

  .btn-home {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>