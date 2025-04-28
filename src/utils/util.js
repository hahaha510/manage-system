/**
 * 工具函数封装
 */
export default {
  // 格式化化日期  data是一个日期对象Date rule是格式
  // 就是把yyyy-MM-dd hh:mm:ss 变成我们日期对象里具体的数呗
  formateDate(date, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear());
    }
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? val : ("00" + val).substr(val.length)
        );
      }
    }
    return fmt;
  },
  // 根据menuLit产生动态路由
  generateRoute(menuList) {
    let routes = [];
    const deepList = (list) => {
      while (list.length) {
        let item = list.pop();
        if (item.action) {
          routes.push({
            name: item.component,
            path: item.path,
            meta: {
              title: item.menuName,
            },
            component: item.component,
          });
        }
        if (item.children && !item.action) {
          deepList(item.children);
        }
      }
    };
    deepList(menuList);
    return routes;
  },
};
