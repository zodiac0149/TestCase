import { http } from './http';

export const generationApi = {
  generate: (payload) => http.post('/generate/tests', payload).then((res) => res.data.data),
  regenerate: (payload) => http.post('/generate/regenerate', payload).then((res) => res.data.data),
  chat: (payload) => http.post('/chat', payload).then((res) => res.data.data),
  exportUrl: (format, projectId) => `${http.defaults.baseURL}/export/${format}/${projectId}`,
};
