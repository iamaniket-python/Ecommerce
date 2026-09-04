import axiosInstance from "./axiosInstance";

export const getProducts = (params = {}) => {
  return axiosInstance.get("/products/", { params });
};

export const getProductById = (id) => {
  return axiosInstance.get(`/products/${id}/`);
};

export const createProduct = (data) => {
  return axiosInstance.post("/products/", data);
};

export const updateProduct = (id, data) => {
  return axiosInstance.patch(`/products/${id}/`, data);
};

export const deleteProduct = (id) => {
  return axiosInstance.delete(`/products/${id}/`);
};

export const getCategories = () => {
  return axiosInstance.get("/categories/");
};