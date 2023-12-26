import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://pomo-backend.onrender.com/api',
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config: any) => {
  const excludedRoutes = ['/login', '/signup', '/googleSignUp'];

  if (!excludedRoutes.some((route) => config.url.includes(route))) {
    const accessToken = localStorage.getItem('access_token');

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;
