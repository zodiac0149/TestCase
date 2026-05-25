import { http } from './http';

export const authApi = {
  signup: (payload) => http.post('/auth/signup', payload).then((res) => res.data.data),
  login: (payload) => http.post('/auth/login', payload).then((res) => res.data.data),
};
