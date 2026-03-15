import axiosInstance from "@/api-calls/index.js";

export const GetUnitiesByProjectId = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/api/projects/${projectId}/unities`);
        return response.data;
    } catch (error) {
        return error.response?.data || {
            success: false,
            message: "Nu s-au putut obține unitățile proiectului",
        };
    }
};