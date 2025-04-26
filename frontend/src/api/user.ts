import { User, UserUpdate } from "../types/user";
import { handleFetch } from "./fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUser = async (): Promise<User> => {
  try {
    return await handleFetch(`${API_BASE_URL}/user/me`, {
      method: "GET",
      withCredentials: true,
      redirectOnUnAuthorized: true,
    });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (data: UserUpdate): Promise<User> => {
  try {
    console.log("update user", data);
    return await handleFetch(`${API_BASE_URL}/user/me`, {
      method: "PATCH",
      data: {
        fullName: data.fullName,
        age: data.age,
        experienceLevel: data.experienceLevel,
      },
      withCredentials: true,
      redirectOnUnAuthorized: true,
    });
  } catch (error) {
    throw error;
  }
};
