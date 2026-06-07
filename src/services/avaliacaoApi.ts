import api from './api';
import type { Carona, Usuario } from './caronaApi';

export interface Avaliacao {
  id: string;
  caronaId: string;
  avaliadorId: string;
  avaliadoId: string;
  nota: number;
  comentario?: string | null;
  createdAt: string;
  updatedAt: string;
  carona?: Carona;
  avaliador?: Usuario;
  avaliado?: Usuario;
}

export interface CreateAvaliacaoDTO {
  caronaId: string;
  avaliadorId: string;
  avaliadoId: string;
  nota: number;
  comentario?: string;
}

export const avaliacaoApi = {
  create: async (data: CreateAvaliacaoDTO): Promise<Avaliacao> => {
    const response = await api.post<Avaliacao>('/avaliacoes', data);
    return response.data;
  },

  findByUsuario: async (usuarioId: string): Promise<Avaliacao[]> => {
    const response = await api.get<Avaliacao[]>(`/avaliacoes/usuario/${usuarioId}`);
    return response.data;
  },
};

export default avaliacaoApi;
