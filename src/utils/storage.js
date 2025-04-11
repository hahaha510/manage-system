/**
 * Storage二次封装
 * 输出格式如下
 * namespace（在config里）:{name:'zhangsan',age:"12"}
 * 拿namespace相当于拿到这对象
 */

import config from "../config";

export default {
  setItem(key, val) {
    let storage = this.getStorage();
    storage[key] = val;
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  getItem(key) {
    return this.getStorage[key];
  },
  // 得到改命名空间的对象 里面存了key和val
  getStorage() {
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}");
  },
  // 清除指定的键值对
  clearItem(key) {
    let storage = this.getStorage();
    delete storage[key];
    window.localStorage.setItem(config.namespace, JSON.stringify(storage));
  },
  // 清除全部
  clearAll() {
    window.localStorage.clear();
  },
};
