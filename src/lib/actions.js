import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';
// Set up a base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API

// Function to get the Bearer token
const getToken = () => {
    const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY);
    return token;
};

// Set up Axios headers with Bearer token
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const setTokenToAxios = (token) => {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

export const signin = async (data) => {
    try {
        const response = await axiosInstance.post('login', data)
        if (response?.data?.meta?.token) {
            localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY,response?.data?.meta?.token);
            setTokenToAxios(response?.data?.meta?.token);
        }
        return response?.data
    } catch (error) {
        console.error('Error on signIn:', error);
        if (axios.isAxiosError(error)) {
            return { error: true, message: error.response?.data?.message || 'An unexpected error occurred' };
        }
        throw error;
    }

};

// Create a new entry (POST)
export const createCompany = async (data) => {
    try {
        const response = await axiosInstance.post('company', data)
        return response?.data;
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }

};

// Get all companys (GET)
export const getCompanies = async (page=1) => {
    noStore();
    try {
        const response = await axiosInstance.get('company', {
            params: {
                page
            }
        });
        // Fetching all companies
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

// Get a specific company (GET)
export const getCompany = async (id) => {
    noStore();
    try {
        const response = await axiosInstance.get(`company/${id}`); // Fetching single company by ID
        return response.data;
    } catch (error) {
        console.error('Error fetching company:', error);
        throw error;
    }
};

// Update an existing company (PUT)
export const updateCompany = async (id, data) => {
    try {
        const response = await axiosInstance.post(`company/${id}?_method=PATCH`, data); // Updating company
        return response.data;
    } catch (error) {
        console.error('Error updating company:', error);
        throw error;
    }
};

// Delete an company (DELETE)
export const deleteCompany = async (id) => {
    try {
        const response = await axiosInstance.delete(`company/${id}`); // Deleting company by ID
        return response.data;
    } catch (error) {
        console.error('Error deleting company:', error);
        throw error;
    }
};

export const signout = async (data) => {
    try {
        const response = await axiosInstance.post('logout', data)
        localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY, null);
        setTokenToAxios(null);
        return response?.data
    } catch (error) {
        console.error('Error on Log out:', error);
        if (axios.isAxiosError(error)) {
            return { error: true, message:'An unexpected error occurred' };
        }
        throw error;
    }

};

// Create a new employee (POST)
export const createEmployee = async (data) => {
    try {
        const response = await axiosInstance.post('employee', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response?.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// Get all employees (GET)
export const getEmployees = async (page) => {
    noStore();
    try {
        const response = await axiosInstance.get('employee', {
            params: { page },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

// Get a specific employee (GET)
export const getEmployee = async (id) => {
    noStore();
    try {
        const response = await axiosInstance.get(`employee/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee:', error);
        throw error;
    }
};

// Update an existing employee (PUT)
export const updateEmployee = async (id, data) => {
    try {
        const response = await axiosInstance.post(`employee/${id}?_method=PATCH`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

// Delete an employee (DELETE)
export const deleteEmployee = async (id) => {
    try {
        const response = await axiosInstance.delete(`employee/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};
