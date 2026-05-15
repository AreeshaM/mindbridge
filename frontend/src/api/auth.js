// src/api/auth.js

import api from './axiosInstance'

// Register request
export async function registerUser(name, email, password) {
  const response = await api.post('/auth/register', {
    name,
    email,
    password
  })
  return response.data
}

// Login request
export async function loginUser(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password
  })
  return response.data
}
export async function sendChatMessage(message, mood) {
  const response = await api.post('/ai/chat', { message, mood })
  return response.data
}