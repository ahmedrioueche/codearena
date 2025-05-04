import axios from "axios";
import { UserCreate } from "../types/user";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with default credentials
const authAxios = axios.create({
  withCredentials: true,
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (data: UserCreate) => {
  try {
    console.log("API_BASE_URL", API_BASE_URL);
    const response = await authAxios.post("/auth/signup", {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await authAxios.post("/auth/signin", {
      email: email,
      password: password,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const logout = async () => {
  try {
    await authAxios.post("/auth/logout");
  } catch (e) {
    throw e;
  }
};

export const sendOtp = async (email: string) => {
  try {
    const response = await authAxios.post("/auth/send-otp", { email });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await authAxios.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export const refreshToken = async () => {
  try {
    const response = await authAxios.post("/auth/refresh", {
      withCredentials: true,
    });

    return response.data;
  } catch (e) {
    throw e;
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  try {
    const response = await authAxios.post("/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};
