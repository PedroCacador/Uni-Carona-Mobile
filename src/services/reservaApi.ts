import api from './api';
import type { Carona, Usuario } from './caronaApi';

export enum StatusReserva {
  PENDENTE = 'PENDENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
}

export interface Reserva {
  id: string;
  status: StatusReserva;
  quantidadePessoas: number;
  caronaId: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;
  carona?: Carona;
  passageiro?: Usuario;
}

export interface CreateReservaDTO {
  caronaId: string;
  usuarioId: string;
  quantidadePessoas: number;
}

export interface UpdateReservaStatusDTO {
  status: StatusReserva;
}

export interface CancelReservaResponse {
  message: string;
  reserva: Reserva;
}

export const reservaApi = {
  create: async (data: CreateReservaDTO): Promise<Reserva> => {
    const response = await api.post<Reserva>('/reservas', data);
    return response.data;
  },

  findAll: async (): Promise<Reserva[]> => {
    const response = await api.get<Reserva[]>('/reservas');
    return response.data;
  },

  findById: async (id: string): Promise<Reserva> => {
    const response = await api.get<Reserva>(`/reservas/${id}`);
    return response.data;
  },

  findByCarona: async (caronaId: string): Promise<Reserva[]> => {
    const response = await api.get<Reserva[]>(`/reservas/carona/${caronaId}`);
    return response.data;
  },

  findByUsuario: async (usuarioId: string): Promise<Reserva[]> => {
    const response = await api.get<Reserva[]>(`/reservas/usuario/${usuarioId}`);
    return response.data;
  },

  updateStatus: async (id: string, status: StatusReserva): Promise<Reserva> => {
    const response = await api.patch<Reserva>(`/reservas/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id: string): Promise<CancelReservaResponse> => {
    const response = await api.delete<CancelReservaResponse>(`/reservas/${id}`);
    return response.data;
  },
};

export default reservaApi;
