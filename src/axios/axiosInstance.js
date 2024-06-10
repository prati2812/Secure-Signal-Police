import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const url = 'http://192.168.200.148:3000';

const instance = axios.create({
    baseURL:url,
    timeout:15000,
    headers:{
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (config.data instanceof FormData) {
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                config.headers['Content-Type'] = 'application/json';
            }


        } catch (error) {
            console.error('Error fetching token from AsyncStorage:', error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export default instance;