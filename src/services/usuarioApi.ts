import api from './api';
import type { Usuario } from './caronaApi';

export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface CreateUsuarioDTO {
  nome: string;
  senha: string;
  email: string;
  cpf: string;
  matricula?: string;
  curso: string;
  dataNascimento: string | Date;
  role?: Role | string;
}

export interface UpdateUsuarioDTO {
  nome?: string;
  senha?: string;
  matricula?: string | null;
  curso?: string;
  dataNascimento?: string | Date;
  role?: Role | string;
}

export const usuarioApi = {
  create: async (data: CreateUsuarioDTO): Promise<Usuario> => {
    const response = await api.post<Usuario>('/usuarios', data);
    return response.data;
  },

  findAll: async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  findById: async (id: string): Promise<Usuario> => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateUsuarioDTO): Promise<Usuario> => {
    const response = await api.patch<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },
};

export default usuarioApi;
