<template>
  <h1>欢迎来到登录页</h1>
  <router-link to="/welcome">跳转到欢迎页</router-link>
</template>

<script>
export default {
  mounted() {
    // this.$request({
    //   method: 'get',
    //   url: '/login'
    // }).then((res) => {
    //   console.log(res)
    // })
    this.$request.get('/login', { name: "jack" }).then((res) => {
      console.log(res)
    })
  }
}
</script>

<style scoped></style>