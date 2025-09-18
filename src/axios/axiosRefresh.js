// ./axios/axiosRefresh.js
import { axiosBaseURL, setAccessToken, removeAccessToken } from "./axios";

axiosBaseURL.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosBaseURL.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return axiosBaseURL(originalRequest);
      } catch (err) {
        removeAccessToken();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
