import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу если он есть
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Токен истек или недействителен
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Masters API
export const mastersAPI = {
  getAll: (params) => api.get('/masters', { params }),
  getAllSorted: (params) => api.get('/masters/all', { params }),
  getAllFiltered: (params) => api.get('/masters/filtered', { params }),
  getById: (id) => api.get(`/masters/${id}`),
  exists: (id) => api.get(`/masters/${id}/exists`),
  create: (data) => api.post('/masters', data),
  update: (id, data) => api.put(`/masters/${id}`, data),
  delete: (id) => api.delete(`/masters/${id}`),
  search: (params) => api.get('/masters/search', { params }),
  getWithMaintenance: (id) => api.get(`/masters/${id}/with-maintenance`),
  getStatistics: (id) => api.get(`/masters/${id}/statistics`)
};

// Workers API
export const workersAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getAllSorted: (params) => api.get('/workers/all', { params }),
  getAllFiltered: (params) => api.get('/workers/filtered', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  exists: (id) => api.get(`/workers/${id}/exists`),
  create: (data) => api.post('/workers', data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  delete: (id) => api.delete(`/workers/${id}`),
  search: (params) => api.get('/workers/search', { params }),
  getWithMaster: (id) => api.get(`/workers/${id}/with-master`)
};

// Machines API
export const machinesAPI = {
  getAll: (params) => api.get('/machines', { params }),
  getAllSorted: (params) => api.get('/machines/all', { params }),
  getAllFiltered: (params) => api.get('/machines/filtered', { params }),
  getById: (id) => api.get(`/machines/${id}`),
  exists: (id) => api.get(`/machines/${id}/exists`),
  create: (data) => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),
  search: (params) => api.get('/machines/search', { params }),
  getWithMaintenance: (id) => api.get(`/machines/${id}/with-maintenance`),
  getStatistics: (id) => api.get(`/machines/${id}/statistics`)
};

// Maintenance API
export const maintenanceAPI = {
  getAll: (params) => api.get('/maintenance', { params }),
  getAllSorted: (params) => api.get('/maintenance/all', { params }),
  getAllFiltered: (params) => api.get('/maintenance/filtered', { params }),
  getById: (id) => api.get(`/maintenance/${id}`),
  exists: (id) => api.get(`/maintenance/${id}/exists`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  delete: (id) => api.delete(`/maintenance/${id}`),
  search: (params) => api.get('/maintenance/search', { params }),
  getAllDetailed: (params) => api.get('/maintenance/detailed/all', { params }),
  getDetailed: (id) => api.get(`/maintenance/${id}/detailed`),
  getByState: (state, params) => api.get(`/maintenance/state/${state}`, { params })
};

export default api;