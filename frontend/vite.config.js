import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        form: resolve(__dirname, "src/form/form.html"),
        produit: resolve(__dirname, "src/produit/produit.html"),
        login: resolve(__dirname, "src/components/login/login.html"),
        users: resolve(__dirname, "src/users/users.html"),
      },
    },
  },
});
