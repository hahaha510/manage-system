import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  // 定义变量
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 写vite配置更改端口,配置 代理
  server: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
      },
    },
  },
  plugins: [vue()],
});
