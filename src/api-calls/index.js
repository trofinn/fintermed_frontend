import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // Base API URL
    headers: {
        "Content-Type": "application/json", // Default headers
        Authorization: `Bearer ${localStorage.getItem(`token`)}`
    },
});