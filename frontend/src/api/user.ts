import { User, UserUpdate } from "../types/user";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUser = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/user/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (data: UserUpdate): Promise<User> => {
  try {
    const response = await axios.patch<User>(
      `${API_BASE_URL}/user/me`,
      {
        fullName: data?.fullName,
        isVerified: data?.isVerified,
        age: data?.age,
        experienceLevel: data?.experienceLevel,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    // Axios error will contain status code and response data
    throw error;
  }
};
