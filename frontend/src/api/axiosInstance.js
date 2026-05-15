// src/api/axiosInstance.js

import axios from 'axios'

// Yeh ek ready-made axios object hai
// Har request automatically localhost:8000 pe jayegi
// Baar baar URL likhne ki zaroorat nahi

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
})

// Yeh interceptor har request se pehle chalta hai
// Token localStorage mein ho toh automatically header mein lagata hai
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api