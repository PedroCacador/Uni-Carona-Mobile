import api from './api';
import type { Veiculo } from './caronaApi';

export interface CreateVeiculoDTO {
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
}

export interface UpdateVeiculoDTO {
  placa?: string;
  marca?: string;
  modelo?: string;
  cor?: string;
}

export const veiculoApi = {
  create: async (data: CreateVeiculoDTO): Promise<Veiculo> => {
    const response = await api.post<Veiculo>('/veiculos', data);
    return response.data;
  },

  findAll: async (): Promise<Veiculo[]> => {
    const response = await api.get<Veiculo[]>('/veiculos');
    return response.data;
  },

  findById: async (id: string): Promise<Veiculo> => {
    const response = await api.get<Veiculo>(`/veiculos/${id}`);
    return response.data;
  },

  findByMotorista: async (motoristaId: string): Promise<Veiculo> => {
    const response = await api.get<Veiculo>(`/veiculos/motorista/${motoristaId}`);
    return response.data;
  },

  findByProprietario: async (proprietarioId: string): Promise<Veiculo> => {
    const response = await api.get<Veiculo>(`/veiculos/motorista/${proprietarioId}`);
    return response.data;
  },

  update: async (id: string, data: UpdateVeiculoDTO): Promise<Veiculo> => {
    const response = await api.put<Veiculo>(`/veiculos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/veiculos/${id}`);
  },
};

export default veiculoApi;
