<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="user-info">用户信息</div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

</script>

<style scoped lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    height: 100vh;
    width: 200px;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width .5s;
  }

  .content-right {
    margin-left: 200px;
    height: 100vh;

    .nav-top {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      height: 50px;
      width: 100%;
      background-color: burlywood;
      border: 1px solid #ddd;
    }

    .wrapper {
      padding: 20px;
      background-color: #eef0f3;
      height: 100%;

      .main-page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>