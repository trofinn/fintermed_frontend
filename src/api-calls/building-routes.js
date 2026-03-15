import axiosInstance from "@/api-calls/index.js";


export const CreateNewProject = async (projectData) => {
    try {
        const response = await axiosInstance.post("/api/projects/new", projectData);
        return response.data; // expecting backend to return { success: true/false, message, data }
    } catch (error) {
        // fallback in case error.response is undefined
        return error.response?.data || { success: false, message: "A apărut o eroare la crearea proiectului" };
    }
};

export const CreateNewUnity = async (unityData) => {
    try {
        const response = await axiosInstance.post("/api/projects/new-unit", unityData);
        return response.data; // expecting backend to return { success: true/false, message, data }
    } catch (error) {
        // fallback in case error.response is undefined
        return error.response?.data || { success: false, message: "A apărut o eroare la crearea unității" };
    }
};

export const UpdateProjectCall = async (projectId, projectData) => {
    console.log("call update");
    try {
        const response = await axiosInstance.put(`/api/update-project/${projectId}`, projectData);
        console.log("resposne update = ", response);
        return response.data; // expecting backend to return { success: true/false, message, data }
    } catch (error) {
        console.log("resposne update = ", error);
        // fallback in case error.response is undefined
        return error.response?.data || { success: false, message: "A apărut o eroare la actualizarea proiectului" };
    }
};