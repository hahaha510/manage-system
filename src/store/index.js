/**
 *
 * Vuex状态管理
 */

import mutations from "./mutations";
import storage from "../utils/storage";
import { createStore } from "vuex";
const state = {
  userInfo: storage.getItem("userInfo") || {},
  menuList: storage.getItem("menuList") || [],
  actionList: storage.getItem("actionList") || [],
  noticeCount: 0,
};
export default createStore({
  state,
  mutations,
});
