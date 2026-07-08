import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, timeout: 20000 });

export const getConfig = () => api.get('/config').then(r => r.data);
export const createLead = (payload) => api.post('/leads', payload).then(r => r.data);
export const createOrder = (lead_id) => api.post('/orders/create', { lead_id }).then(r => r.data);
export const verifyPayment = (payload) => api.post('/orders/verify', payload).then(r => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const downloadUrl = (order_id, token) => `${API}/download/${order_id}?token=${token}`;
