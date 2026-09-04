import axiosInstance from "./axiosInstance";

export const registerUser = (data) => {
  return axiosInstance.post("/accounts/register/", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/accounts/login/", data);
};

export const getMe = () => {
  return axiosInstance.get("/accounts/me/");
};

export const updateMe = (data) => {
  return axiosInstance.patch("/accounts/me/", data);
};