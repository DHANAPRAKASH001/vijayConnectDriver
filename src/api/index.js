// src/api/mainAxios.js
import axios from 'axios';
import { Logger } from '../utils/logger';
import { Alert } from 'react-native';
import store from '../store';

// Base URL for API
const BASE_URL = "http://192.168.1.34:3000";

// Create Axios instance for main API
export const mainAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add Authorization header
mainAxios.interceptors.request.use(
    async (config) => {
        try {
            const accessToken = store.getState().auth.accessToken; // Retrieve token from Redux store

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            Logger.api.request(config.url, { method: config.method, headers: config.headers, data: config.data });
            return config;
        } catch (error) {
            Logger.api.error('Request interceptor error:', { error: error.message });
            return Promise.reject(error);
        }
    },
    (error) => {
        Logger.api.error('Request preparation error:', { error: error.message });
        return Promise.reject(error);
    }
);

// Response interceptor to handle and log responses or errors
mainAxios.interceptors.response.use(
    (response) => {
        Logger.api.response(response.config.url, response.data);
        return response;
    },
    async (error) => {
        Logger.api.error('Response interceptor error:', {
            error: error.message,
            response: error.response ? error.response.data : 'No response data',
            status: error.response ? error.response.status : 'No status',
        });

        if (error.response) {
            const { status } = error.response;
            if (status === 403) {
                Alert.alert('Session expired', 'Please log in again.');
            }
            // else {
            //     Alert.alert('Error', `An unexpected error occurred. Please try again. ${status}`);
            // }
        } else {
            Alert.alert('Network Error', 'Unable to reach the server. Please check your internet connection.');
        }

        return Promise.reject(error);
    }

);
