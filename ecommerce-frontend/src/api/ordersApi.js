import axiosInstance from "./axiosInstance";

export const createOrder = (data) => {
  return axiosInstance.post("/orders/", data);
};

export const getOrders = () => {
  return axiosInstance.get("/orders/");
};

export const getOrderById = (id) => {
  return axiosInstance.get(`/orders/${id}/`);
};