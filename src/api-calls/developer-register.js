
import axiosInstance from "@/api-calls/index.js";


export const DeveloperRegister = async (developerData) => {
    try {
        const response = await axiosInstance.post("/api/developer-register", developerData);
        return response.data; // expecting backend to return { success: true/false, message, data }
    } catch (error) {
        // fallback in case error.response is undefined
        return error.response?.data || { success: false, message: "A apărut o eroare la înregistrare" };
    }
};


export const GetCurrentDeveloper = async () => {

    try {
        const response = await axiosInstance.get("/api/developers/me");

        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Nu s-a putut obține utilizatorul curent" };
    }
};


export const LoginDeveloper = async (credentials) => {

    try {
        const response = await axiosInstance.post("/api/developers/login", credentials);
        return response.data;
    } catch (error) {

        return error.response?.data || { success: false, message: "Autentificare eșuată" };
    }
};