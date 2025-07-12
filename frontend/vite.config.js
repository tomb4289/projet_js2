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
        cart: resolve(__dirname, "src/components/cart/cart.html"),
        checkout: resolve(__dirname, "src/components/checkout/checkout.html"),
        confirmation: resolve(__dirname, "src/components/order-confirmation/confirmation.html"),
        admin: resolve(__dirname, "src/components/admin/admin.html"),
      },
    },
  },
});
