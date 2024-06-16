import axios from "axios";
import { getAuthToken } from "./getAuthToken";

export const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});
