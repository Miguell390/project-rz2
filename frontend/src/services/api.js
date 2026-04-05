import axios from 'axios';

// The Backend is still on 5000, even though Frontend moved to 5174
const API_URL = 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

//This helps send the JWT token automatically later in Sprint 1
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const loginUser = (data) => api.post('/auth/login', data);

export const getEvents = () => api.get('/events');
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const activateEvent = (id) => api.put(`/events/${id}/activate`);

export default api;