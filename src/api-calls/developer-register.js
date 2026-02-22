// src/api-calls/developer-register.js
import { axiosInstance } from ".";

/**
 * Register a new developer (Dezvoltator)
 * @param {Object} developerData - All form fields from the frontend
 * @returns {Object} - { success: boolean, message?: string, data?: any }
 */
export const DeveloperRegister = async (developerData) => {
    try {
        const response = await axiosInstance.post("/api/developers/register", developerData);
        return response.data; // expecting backend to return { success: true/false, message, data }
    } catch (error) {
        // fallback in case error.response is undefined
        return error.response?.data || { success: false, message: "A apărut o eroare la înregistrare" };
    }
};

/**
 * Get current logged-in developer info
 */
export const GetCurrentDeveloper = async () => {
    try {
        const response = await axiosInstance.get("/api/developers/me");
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Nu s-a putut obține utilizatorul curent" };
    }
};

/**
 * Login developer
 * @param {Object} credentials - { email, password }
 */
export const LoginDeveloper = async (credentials) => {
    try {
        const response = await axiosInstance.post("/api/developers/login", credentials);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Autentificare eșuată" };
    }
};