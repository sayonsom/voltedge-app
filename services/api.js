import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const parcelService = {
  // Get all parcels
  getAllParcels: (page = 1, limit = 10, city = null) => {
    const params = { page, limit };
    if (city) params.city = city;
    return api.get('/parcels', { params });
  },

  // Get single parcel
  getParcelById: (id) => {
    return api.get(`/parcels/${id}`);
  },

  // Get financials
  getParcelFinancials: (id, datacenterSize = null) => {
    const params = {};
    if (datacenterSize) params.datacenter_size = datacenterSize;
    return api.get(`/parcels/${id}/financials`, { params });
  },

  // Get power infrastructure
  getParcelPower: (id) => {
    return api.get(`/parcels/${id}/power`);
  },

  // Search parcels
  searchParcels: (filters) => {
    return api.get('/parcels/search', { params: filters });
  },
};

export const cityService = {
  getAllCities: () => api.get('/cities'),
};

export const consultantService = {
  getAllConsultants: (specialty = null) => {
    const params = {};
    if (specialty) params.specialty = specialty;
    return api.get('/consultants', { params });
  },
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
