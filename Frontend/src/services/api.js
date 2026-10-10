const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
).replace(/\/$/, '');

const apiRequest = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const registerUser = async (userData) => {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const loginUser = async (userData) => {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const getProfile = async () => {
  return apiRequest('/api/auth/profile');
};

export const getCurrentWeather = async (city) => {
  return apiRequest(
    `/api/weather/current?city=${encodeURIComponent(city)}`
  );
};

export const getForecast = async (city) => {
  return apiRequest(
    `/api/weather/forecast?city=${encodeURIComponent(city)}`
  );
};

export const getFavorites = async () => {
  return apiRequest('/api/favorites');
};

export const addFavorite = async (favoriteData) => {
  return apiRequest('/api/favorites', {
    method: 'POST',
    body: JSON.stringify(favoriteData)
  });
};

export const deleteFavorite = async (favoriteId) => {
  return apiRequest(`/api/favorites/${favoriteId}`, {
    method: 'DELETE'
  });
};

export const getAIRecommendation = async (city) => {
  return apiRequest('/api/ai/recommendation', {
    method: 'POST',
    body: JSON.stringify({ city })
  });
};