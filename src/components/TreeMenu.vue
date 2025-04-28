<template v-if="props.userMenu && props.userMenu.length > 0">
  <template v-for="menu of props.userMenu">
    <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :index="menu.path">
      <template #title>
        <component :is="getIconComponent(menu.icon)" class="icon"></component>
        <span>{{ menu.menuName }}</span>
      </template>
      <TreeMenu :userMenu="menu.children"></TreeMenu>
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">{{ menu.menuName }}</el-menu-item>
  </template>
</template>

<script setup>
import {
  Setting,
  Promotion
} from '@element-plus/icons-vue';
import { computed } from 'vue';
const props = defineProps({
  userMenu: Array,
})
const getIconComponent = computed(() => {
  return (iconName) => {
    switch (iconName) {
      case 'Setting':
        return Setting;
      case 'Promotion':
        return Promotion
      // 添加更多图标名称和对应的组件映射
      default:
        return null;
    }
  };
});
</script>
<style scoped>
.icon {
  width: 20px;
  height: 20px;
}
</style>
