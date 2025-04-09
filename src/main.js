import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import axios from "axios";
import config from "./config";
// 环境变量在import.env里
// console.log("环境变量=>", import.meta.env);
const app = createApp(App);
axios.get(config.mockApi + "/login").then((res) => {
  console.log(res);
});
app.use(ElementPlus);
app.use(router).mount("#app");
