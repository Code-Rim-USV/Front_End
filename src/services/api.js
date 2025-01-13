import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7250/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor to handle token expiration and specific error messages
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Handle specific error messages based on response
      if (status === 400) {
        const errorMessage = data.message || data;
        throw new Error(errorMessage);
      }

      if (status === 401) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error(HttpResponses.msg13);
      }

      if (status === 404) {
        throw new Error(HttpResponses.msg14);
      }
    }

    // Network errors or other issues
    throw new Error('A apărut o eroare în comunicarea cu serverul');
  }
);

export default api; 