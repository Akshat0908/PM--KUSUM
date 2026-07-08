import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 20000 });

export const getConfig = () => api.get('/config').then(r => r.data);
export const createLead = (payload) => api.post('/leads', payload).then(r => r.data);
