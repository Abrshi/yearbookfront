// ./axios/axios.js
import axios from "axios";

// Base axios instance
export const axiosBaseURL = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies (for refresh token)
});

// Request interceptor to attach access token
export const setAccessToken = (token) => {
  axiosBaseURL.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Remove token (on logout)
export const removeAccessToken = () => {
  delete axiosBaseURL.defaults.headers.common["Authorization"];
};
