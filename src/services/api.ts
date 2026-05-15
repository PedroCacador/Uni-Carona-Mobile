import axios from 'axios';

const BASE_URL = 'http://192.168.18.12:3333';

const api = axios.create({
  baseURL: BASE_URL,
});

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

  searchPlaces: async (query: string, lat?: number, lng?: number): Promise<GeocodingResult[]> => {
    const response = await api.get('/maps/search', {
      params: { 
        q: query,
        lat,
        lng
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
