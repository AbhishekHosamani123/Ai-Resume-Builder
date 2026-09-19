import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // Generous timeout: serverless platforms have cold starts and free-tier
  // MongoDB clusters can be slow to respond on the first request.
  timeout: 30000,
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
          // Only clear the session and redirect when an authenticated request
          // was rejected (a token was actually attached). A 401 from the
          // login/register endpoints just means wrong credentials — the form
          // should display the error instead of redirecting.
          if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            window.location.href = '/'
          }
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