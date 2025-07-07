export const env = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5252/api",
  BACKEND_USERS_URL:
    import.meta.env.VITE_BACKEND_USERS_URL || "http://localhost:5252/api/users",
  BACKEND_PRODUCTS_URL:
    import.meta.env.VITE_BACKEND_PRODUCTS_URL ||
    "http://localhost:5252/api/products",
};