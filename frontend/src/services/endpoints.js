import API from './api';

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const signupUser = (data) => API.post('/auth/signup', data);
export const getMe = () => API.get('/auth/me');

// Projects
export const getProjects = () => API.get('/projects');
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const getMembers = () => API.get('/projects/members');

// Tasks
export const getTasks = (params) => API.get('/tasks', { params });
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const updateTaskStatus = (id, status) =>
  API.patch(`/tasks/${id}/status`, { status });

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');
