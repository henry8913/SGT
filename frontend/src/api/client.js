import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const projects = {
  list: () => api.get('/projects'),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  duplicate: (id) => api.post(`/projects/${id}/duplicate`),
};

export const machine = {
  get: (pid) => api.get(`/projects/${pid}/machine`),
  create: (pid, data) => api.post(`/projects/${pid}/machine`, data),
  update: (pid, data) => api.put(`/projects/${pid}/machine`, data),
};

export const geometry = {
  list: (pid) => api.get(`/projects/${pid}/geometry`),
  create: (pid, data) => api.post(`/projects/${pid}/geometry`, data),
  update: (pid, id, data) => api.put(`/projects/${pid}/geometry/${id}`, data),
  delete: (pid, id) => api.delete(`/projects/${pid}/geometry/${id}`),
};

export const masses = {
  list: (pid) => api.get(`/projects/${pid}/masses`),
  create: (pid, data) => api.post(`/projects/${pid}/masses`, data),
  update: (pid, id, data) => api.put(`/projects/${pid}/masses/${id}`, data),
  delete: (pid, id) => api.delete(`/projects/${pid}/masses/${id}`),
};

export const windAreas = {
  list: (pid) => api.get(`/projects/${pid}/wind-areas`),
  create: (pid, data) => api.post(`/projects/${pid}/wind-areas`, data),
  update: (pid, id, data) => api.put(`/projects/${pid}/wind-areas/${id}`, data),
  delete: (pid, id) => api.delete(`/projects/${pid}/wind-areas/${id}`),
};

export const stability = {
  list: (pid) => api.get(`/projects/${pid}/stability`),
  create: (pid, data) => api.post(`/projects/${pid}/stability`, data),
  update: (pid, id, data) => api.put(`/projects/${pid}/stability/${id}`, data),
  delete: (pid, id) => api.delete(`/projects/${pid}/stability/${id}`),
};

export const loadCurves = {
  list: (pid) => api.get(`/projects/${pid}/load-curves`),
  create: (pid, data) => api.post(`/projects/${pid}/load-curves`, data),
  update: (pid, id, data) => api.put(`/projects/${pid}/load-curves/${id}`, data),
  delete: (pid, id) => api.delete(`/projects/${pid}/load-curves/${id}`),
};

export const coefficients = {
  list: (params) => api.get('/coefficients', { params }),
  moduli: () => api.get('/coefficients/moduli'),
  create: (data) => api.post('/coefficients', data),
  updateDraft: (id, data) => api.put(`/coefficients/${id}`, data),
  publish: (id) => api.post(`/coefficients/${id}/pubblica`),
  remove: (id) => api.delete(`/coefficients/${id}`),
};

export const moduleDocs = {
  get: () => api.get('/module-docs'),
  saveNote: (data) => api.put('/module-docs/notes', data),
  conferma: (modulo) => api.post(`/module-docs/${modulo}/conferma`),
};

export const modules = {
  status: () => api.get('/modules/status'),
};

export const calculate = {
  run: (pid) => api.post(`/projects/${pid}/calcola`),
  results: (pid) => api.get(`/projects/${pid}/risultati`),
};
