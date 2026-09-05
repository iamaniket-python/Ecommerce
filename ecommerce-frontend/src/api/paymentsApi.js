import axiosInstance from "./axiosInstance";

export const createPayment = (orderId) => {
  return axiosInstance.post("/payments/create/", { order_id: orderId });
};

export const verifyPayment = (data) => {
  return axiosInstance.post("/payments/verify/", data);
};