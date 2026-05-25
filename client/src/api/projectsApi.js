import { http } from './http';

export const projectsApi = {
  create: (payload) => http.post('/projects', payload).then((res) => res.data.data),
  list: () => http.get('/projects').then((res) => res.data.data),
  get: (id) => http.get(`/projects/${id}`).then((res) => res.data.data),
  uploadZip: (formData) => http.post('/repositories/upload', formData).then((res) => res.data.data),
  connectGithub: (payload) => http.post('/repositories/github', payload).then((res) => res.data.data),
  uploadSpecification: (formData) => http.post('/repositories/specification', formData).then((res) => res.data.data),
};
