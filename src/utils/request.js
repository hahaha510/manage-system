/**
 * axios的二次封装
 */

import axios from "axios";
import config from "./../config";
import { ElMessage } from "element-plus";
import router from "../router";
// 定义错误提示常量
const TOKEN_INVALID = "Token认证失败,请重新登陆";
const NET_ERROR = "网络发生错误";

// 创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});

// 请求拦截
service.interceptors.request.use((req) => {
  // 可以对请求做一些处理 如看是否有token
  const headers = req.headers;
  if (!headers.Authorization) headers.Authorization = "Bear jack";
  return req;
});

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data;
  // 这样每次请求得到直接就是数据了 需要res.data
  if (code === 200) {
    return data;
  } else if (code === 40001) {
    ElMessage.error(TOKEN_INVALID);
    setTimeout(() => {
      router.push("login");
    }, 1500);
    return Promise.reject(TOKEN_INVALID);
  } else {
    ElMessage.error(msg || NET_ERROR);
    return Promise.reject(msg || NET_ERROR);
  }
});

/**
 * 请求核心函数
 * @param {*} options
 * 传配置发请求
 */
function request(options) {
  options.method = options.method || "get";
  // 因为get和post传参一个是data 一个是param 这样可以同一为data
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  // 如果请求的传的配置里mock是false 那么就把config里的mock改为请求里的mock
  if (typeof options.mock !== "undefined") {
    config.mock = options.mock;
  }
  // 判断用哪个接口
  if (config.env === "prod") {
    service.defaults.baseURL = config.baseApi;
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
  }
  return service(options);
}

// 给request添加属性、方法 ，可以.get .post
["get", "post", "put", "delete", "patch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    });
  };
});
export default request;
