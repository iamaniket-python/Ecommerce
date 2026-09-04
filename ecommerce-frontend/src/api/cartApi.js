import axiosInstance from "./axiosInstance";

export const getCart = () => {
  return axiosInstance.get("/cart/");
};

export const addToCart = (data) => {
  return axiosInstance.post("/cart/items/add/", data);
};

export const updateCartItem = (id, data) => {
  return axiosInstance.patch(`/cart/items/${id}/`, data);
};

export const removeCartItem = (id) => {
  return axiosInstance.delete(`/cart/items/${id}/`);
};