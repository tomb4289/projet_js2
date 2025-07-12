export const env = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5252",
  BACKEND_USERS_URL:
    import.meta.env.VITE_BACKEND_USERS_URL || "http://localhost:5252/users",
  BACKEND_PRODUCTS_URL:
    import.meta.env.VITE_BACKEND_PRODUCTS_URL ||
    "http://localhost:5252/products",
};
