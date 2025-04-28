<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="./../assets/logo.png" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu :default-active="activeMenu" background-color="#001529" text-color="#fff" router :collapse="isCollapse"
        class="nav-menu">
        <template v-if="menuLoaded">
          <TreeMenu :userMenu="userMenu"></TreeMenu>
        </template>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle"><el-icon :size="20" class="icons">
              <Fold />
            </el-icon></div>
          <div class="bread">
            <BreadCrumb></BreadCrumb>
          </div>
        </div>

        <div class="user-info">
          <el-badge :is-dot="noticeCount" class="notice" type="danger" :offset="[0, 12]"
            @click="router.push('/audit/approve')">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout" class="down">
            <span class="user-link">
              {{ userInfo.userName }}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}
                </el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>

</template>

<script setup>
import { Fold, Bell, Setting } from '@element-plus/icons-vue';
import TreeMenu from './TreeMenu.vue';
import { onMounted, ref } from 'vue';
import { computed } from 'vue';
import store from '../store';
import router from '../router';
import api from '../api';
import BreadCrumb from './BreadCrumb.vue';
let isCollapse = ref(false)
let userInfo = computed(() => store.state.userInfo);
let userMenu = ref([])
let menuLoaded = ref(false)
let activeMenu = ref(location.hash.slice(1))
const noticeCount = computed(() => {
  return store.state.noticeCount
})
onMounted(() => {
  getNoticeCount()
  getMenuList()
})
const toggle = () => {
  isCollapse.value = !isCollapse.value
}
const handleLogout = (key) => {
  // 点击的是邮箱没操作
  if (key === 'email') return;
  store.commit('saveUserInfo', '')
  userInfo.value = null
  router.push('/login')
}
const getNoticeCount = async () => {
  try {
    let count = await api.noticeCount();
    store.commit("saveNoticeCount", count)

  } catch (error) {
    console.error(error);
  }
}

const getMenuList = async () => {
  try {
    const { menuList, actionList } = await api.getPermissionList();
    userMenu.value = menuList;
    menuLoaded.value = true
    store.commit("saveMenuList", menuList)
    store.commit("saveActionList", actionList)
  } catch (error) {
    console.error(error);
  }
}

</script>

<style lang="scss">
.basic-layout {
  position: relative;
  height: 100vh;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100%;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;

      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }

    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }

    // 合并
    &.fold {
      width: 64px;
    }

    // 展开
    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;
    height: 100vh;

    &.fold {
      margin-left: 64px;
    }

    &.unfold {
      margin-left: 200px;
    }

    .nav-top {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      height: 50px;
      width: 100%;
      background-color: burlywood;
      border: 1px solid #ddd;

      .nav-left {
        display: flex;
        justify-content: space-between;

        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }

        .icons {
          width: 50px;
          height: 50px;
        }
      }

      .user-info {
        margin-right: 30px;

        .notice {
          margin-right: 15px;
          cursor: pointer;
        }

        .user-link {
          cursor: pointer;
          color: #409eff;
        }

        .down {
          margin-top: 20px;
        }
      }
    }

    .wrapper {
      padding: 20px;
      background-color: #eef0f3;
      height: 100%;
    }
  }
}
</style>