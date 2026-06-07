import api from './api';

export interface HealthResponse {
  status: 'ok' | string;
}

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
};

export default healthApi;
