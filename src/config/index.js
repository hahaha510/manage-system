/**
 * 环境配置封装
 */

// 这里的封装我觉得很厉害，不能的环境用不用的API接口
const env = import.meta.env.MODE || "prod";
const EnvConfig = {
  dev: {
    baseApi: "/",
    mockApi: " https://mock.presstime.cn/mock/67f66933678740f5d1f7e2a4/api",
  },
  test: {
    baseApi: "//test.future.com/api",
    mockApi: " https://mock.presstime.cn/mock/67f66933678740f5d1f7e2a4/api",
  },
  prod: {
    baseApi: "//future.com/api",
    mockApi: " https://mock.presstime.cn/mock/67f66933678740f5d1f7e2a4/api",
  },
};
export default {
  env,
  mock: true,
  namespace: "manage",
  ...EnvConfig[env],
};
