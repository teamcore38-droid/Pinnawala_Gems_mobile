import axios from "axios";
import { Platform } from 'react-native';

const defaultHost = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || defaultHost,
});

export default API;