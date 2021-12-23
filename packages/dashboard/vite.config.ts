import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "@primary-color": "#ff18d8",
        },
        javascriptEnabled: true,
      },
    },
  },
});
