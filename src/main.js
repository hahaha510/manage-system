import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import storage from "./utils/storage";
import request from "./utils/request";
import api from "./api";
import store from "./store";
import Rocket from "../packages/index.js";
// 环境变量在import.env里
// console.log("环境变量=>", import.meta.env);
const app = createApp(App);
// axios.get(config.mockApi + "/login").then((res) => {
//   console.log(res);
// });
app.directive("has", (el, binding) => {
  let actionList = storage.getItem("actionList");
  let value = binding.value;
  let hasPermission = actionList.includes(value);
  if (!hasPermission) {
    el.style = "display:none";
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 0);
  }
});
// 给app添加全局变量
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
app.config.globalProperties.$store = store;
app.use(ElementPlus, { size: "medium" });
app.use(router).use(store).use(Rocket).mount("#app");
