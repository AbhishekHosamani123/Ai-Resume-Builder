import axios from 'axios'
import { BASE_URL } from './apiPathsjs'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
})

// REQUEST INTERCEPTER
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTER
axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/'
        }
        else if (error.response.status === 500) {
          console.error("Server Error")
          // Check if it's an auth-related 500 error
          if (error.response.data?.message?.includes('token') || 
              error.response.data?.message?.includes('authorized')) {
            localStorage.removeItem('token');
            window.location.href = '/'
          }
        }
      }
      else if (error.code === 'ECONNABORTED') {
        console.error("Request timeout")
      }
      
      // The final step of the interceptor is typically to return a rejected promise
      return Promise.reject(error)
    }
  )

  export default axiosInstance;