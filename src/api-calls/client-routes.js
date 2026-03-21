import axiosInstance from "@/api-calls/index.js";

export async function CreateClientInvitation(payload) {
    window.console.log("call create invitation");
    try {
        const response = await axiosInstance.post("/api/clients/create-invitation", payload)
        return response.data
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "A apărut o eroare la trimiterea invitației.",
        }
    }
}

export async function ValidateClientInvitation(token) {
    try {
        const response = await axiosInstance.post("/api/clients/validate-invitation", {
            token,
        })
        return response.data
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Invitația nu este validă.",
        }
    }
}

export async function RegisterClient(payload) {
    try {
        const response = await axiosInstance.post("/api/clients/register", payload)
        return response.data
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "A apărut o eroare la înregistrarea clientului.",
        }
    }
}

export async function LoginClient(payload) {
    try {
        const response = await axiosInstance.post("/api/clients/login", payload)
        return response.data
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Email sau parolă invalide.",
        }
    }
}

export async function GetCurrentClient() {
    try {
        const response = await axiosInstance.get("/api/clients/me")
        return response.data
    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "A apărut o eroare la preluarea clientului.",
        }
    }
}