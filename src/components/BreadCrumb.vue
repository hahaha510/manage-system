<template>
  <el-breadcrumb separator=">" class="bread">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link to="/welcome" v-if="index == 0">{{ item.meta.title }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const breadList = computed(() => {
  return route.matched
})
</script>
<style>
.bread {
  margin-top: 2px;
  display: flex;
  justify-content: center;
  align-content: center;
}

/*  */
</style>
