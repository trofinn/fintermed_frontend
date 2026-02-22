import { axiosInstance } from ".";

export const DriverRegister = async (driverData) => {
    try {
        const response = await axiosInstance.post('/api/driver-register', driverData);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: "An error occurred" };
    }
};

export const LoginUser = async (user) => {
    try {
        const response = await axiosInstance.post('/api/login', user);
        return response.data;
    }
    catch (error) {
        return error.response.data
    }
};

export const GetCurrentDriver = async () => {
    try {
        const response = await axiosInstance.get('/api/get-current-driver');
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}