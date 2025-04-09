import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Login from "../components/Login.vue";
const routes = [
  {
    name: "name",
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    // 决定下面子路由显示哪个
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        meta: {
          title: "欢迎页",
        },
        component: Welcome,
      },
      {
        path: "/login",
        meta: {
          title: "登录",
        },
        component: Login,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
