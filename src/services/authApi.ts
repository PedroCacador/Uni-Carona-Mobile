import api from './api';
import type { Usuario } from './caronaApi';

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}

export interface EsqueciSenhaDTO {
  email: string;
}

export interface ValidarCodigoDTO {
  email?: string;
  codigo: string;
}

export interface ValidarCodigoResponse {
  valid: true;
}

export interface RedefinirSenhaDTO {
  token: string;
  novaSenha: string;
}

export interface MessageResponse {
  message: string;
}

export const authApi = {
  login: async (data: LoginDTO): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  esqueciSenha: async (data: EsqueciSenhaDTO): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/esqueci-senha', data);
    return response.data;
  },

  validarCodigo: async (data: ValidarCodigoDTO): Promise<ValidarCodigoResponse> => {
    const response = await api.post<ValidarCodigoResponse>('/auth/validar-codigo', data);
    return response.data;
  },

  redefinirSenha: async (data: RedefinirSenhaDTO): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/redefinir-senha', data);
    return response.data;
  },
};

export default authApi;
