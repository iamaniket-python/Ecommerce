import axiosInstance from "./axiosInstance";

export const getSellerDashboard = () => {
  return axiosInstance.get("/seller/dashboard/");
};

export const getSellerInventoryReport = () => {
  return axiosInstance.get("/seller/inventory-report/");
};

export const getSellerSalesReport = (params = {}) => {
  return axiosInstance.get("/orders/seller/sales-report/", { params });
};