/**
 *  api管理
 */

import request from "../utils/request";
export default {
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
      mock: false,
    });
  },
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: false,
    });
  },
  getMenuList(params) {
    return request({
      url: "/menu/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  getUserList(params) {
    return request({
      url: "users/list",
      method: "get",
      data: params,
      // mock: false,
    });
  },
  userDel(params) {
    return request({
      url: "users/delete",
      method: "post",
      data: params,
      mock: false,
    });
  },
  getRoleAllList(params) {
    return request({
      url: "/roles/allList",
      method: "get",
      data: params,
      mock: false,
    });
  },
  getDeptList(params) {
    return request({
      url: "/depts/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  userSubmit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  menuSubmit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  getRoleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  roleOperate(params) {
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  updatePermission(params) {
    return request({
      url: "/roles/update/permission",
      method: "post",
      data: params,
      mock: false,
    });
  },
  deptOperate(params) {
    return request({
      url: "/depts/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  getAllUserList(params) {
    return request({
      url: "/users/all/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  getPermissionList() {
    return request({
      url: "/users/getPermissionList",
      method: "get",
      data: {},
      mock: false,
    });
  },
  getApplyList(params) {
    return request({
      url: "/leave/list",
      method: "get",
      data: params,
      mock: false,
    });
  },
  leaveOperate(params) {
    return request({
      url: "/leave/operate",
      method: "post",
      data: params,
      mock: false,
    });
  },
  leaveApprove(params) {
    return request({
      url: "/leave/approve",
      method: "post",
      data: params,
      mock: false,
    });
  },
  leaveUpload(params) {
    return request({
      url: "/leave/upload",
      method: "post",
      data: params,
      mock: false,
    });
  },
  leaveMerge(params) {
    return request({
      url: "/leave/merge",
      method: "post",
      data: params,
      mock: false,
    });
  },
  leaveVerify(params) {
    return request({
      url: "/leave/verify",
      method: "post",
      data: params,
      mock: false,
    });
  },
};
