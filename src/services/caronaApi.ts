import api from './api';

export interface CaronaFilters {
  origem?: string;
  destino?: string;
  status?: StatusCarona;
  motoristaId?: string;
  apenasFuturas?: boolean;
  dataDe?: string;
  dataAte?: string;
  data?: string;
  vagasDisponiveis?: number;
}

export enum StatusCarona {
  AGENDADA = 'AGENDADA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA'
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  whatsapp: string;
  curso: string;
  role: string;
  status: string;
  dataNascimento: string;
  createdAt: string;
  updatedAt: string;
}

export interface Veiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  cor: string;
  proprietarioId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Carona {
  id: string;
  motoristaId: string;
  veiculoId: string;
  origem: string;
  destino: string;
  dataHoraSaida: string;
  assentosDisponiveis: number;
  valorAjuda?: number;
  status: StatusCarona;
  motorista?: Usuario;
  veiculo?: Veiculo;
}

export interface CreateCaronaDTO {
  motoristaId: string;
  veiculoId: string;
  origem: string;
  destino: string;
  dataHoraSaida: string | Date;
  assentosDisponiveis: number;
  valorAjuda?: number;
}

export interface UpdateCaronaDTO {
  origem?: string;
  destino?: string;
  dataHoraSaida?: string | Date;
  assentosDisponiveis?: number;
  valorAjuda?: number;
  status?: StatusCarona;
}

export interface CaronaResponse {
  id: string;
  motorista: {
    nome: string;
    universidade: string;
    avaliacao?: number;
  };
  origem: string;
  destino: string;
  data: string;
  horario?: string;
  vagas: number;
  preco: number;
  observacoes?: string;
  status: string;
}


// Funções da API de Caronas
export const caronaApi = {
  buscarCaronas: async (filters?: CaronaFilters): Promise<CaronaResponse[]> => {
    const response = await api.get<CaronaResponse[]>('/carona', { params: filters });
    return response.data;
  },

  create: async (data: CreateCaronaDTO): Promise<Carona> => {
    const response = await api.post<Carona>('/carona', data);
    return response.data;
  },

  findAll: async (filters?: {
    origem?: string;
    destino?: string;
    status?: StatusCarona;
    motoristaId?: string;
    apenasFuturas?: boolean;
    dataDe?: string;
    dataAte?: string;
    data?: string;
    vagasDisponiveis?: number;
  }): Promise<Carona[]> => {
    const response = await api.get<Carona[]>('/carona', { params: filters });
    return response.data;
  },

  buscarDisponiveis: async (filters?: {
    origem?: string;
    destino?: string;
    status?: StatusCarona;
    motoristaId?: string;
    apenasFuturas?: boolean;
    dataDe?: string;
    dataAte?: string;
    data?: string;
    vagasDisponiveis?: number;
  }): Promise<Carona[]> => {
    const response = await api.get<Carona[]>('/carona/buscar', { params: filters });
    return response.data;
  },

  findAllActive: async (): Promise<Carona[]> => {
    const response = await api.get<Carona[]>('/carona/ativas');
    return response.data;
  },

  findById: async (id: string): Promise<Carona> => {
    const response = await api.get<Carona>(`/carona/${id}`);
    return response.data;
  },

  findByMotorista: async (motoristaId: string): Promise<Carona[]> => {
    const response = await api.get<Carona[]>(`/carona/motorista/${motoristaId}`);
    return response.data;
  },

  update: async (id: string, data: UpdateCaronaDTO): Promise<Carona> => {
    const response = await api.put<Carona>(`/carona/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: StatusCarona): Promise<Carona> => {
    const response = await api.patch<Carona>(`/carona/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id: string): Promise<{ message: string; carona: Carona }> => {
    const response = await api.delete<{ message: string; carona: Carona }>(`/carona/${id}`);
    return response.data;
  }
};

export default caronaApi;
