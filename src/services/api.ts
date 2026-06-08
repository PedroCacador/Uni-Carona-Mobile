import axios from 'axios';
import localDatabase from './localDatabase';

const rawUrl = process.env.EXPO_PUBLIC_API_URL || '192.168.18.12:3333';
const BASE_URL = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
  ? rawUrl
  : `http://${rawUrl}`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await localDatabase.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token do banco local', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
}

export interface RouteResult {
  coordinates: { latitude: number; longitude: number }[];
  distanceMetros: number;
  duracaoSegundos: number;
}

export const mapsService = {
  getRoute: async (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<RouteResult> => {
    const response = await api.get('/maps/route', {
      params: {
        originLat: origin.lat,
        originLng: origin.lng,
        destLat: destination.lat,
        destLng: destination.lng,
      },
    });
    return response.data;
  },

  searchPlaces: async (query: string, lat?: number, lon?: number, city?: string): Promise<GeocodingResult[]> => {
    const response = await api.get('/maps/search', {
      params: { 
        q: query,
        lat,
        lon,
        city
      },
    });
    return response.data;
  },

  geocode: async (address: string): Promise<GeocodingResult> => {
    const response = await api.get('/maps/geocode', {
      params: { address },
    });
    return response.data;
  }
};

export default api;
