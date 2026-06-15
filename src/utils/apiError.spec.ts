import { AxiosError } from 'axios';
import {
  CONNECTION_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
  getApiErrorMessage,
} from './apiError';

describe('getApiErrorMessage', () => {
  it('retorna fallback para erro não-Axios', () => {
    expect(getApiErrorMessage(new Error('x'), 'fallback')).toBe('fallback');
  });

  it('retorna mensagem de timeout para ECONNABORTED', () => {
    const error = new AxiosError('timeout');
    error.code = 'ECONNABORTED';
    expect(getApiErrorMessage(error, 'fallback')).toBe(TIMEOUT_ERROR_MESSAGE);
  });

  it('retorna mensagem de conexão para ERR_NETWORK', () => {
    const error = new AxiosError('Network Error');
    error.code = 'ERR_NETWORK';
    error.response = undefined;
    expect(getApiErrorMessage(error, 'fallback')).toBe(CONNECTION_ERROR_MESSAGE);
  });

  it('retorna mensagem da API quando há response', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      status: 400,
      data: { message: 'E-mail inválido' },
    } as AxiosError['response'];
    expect(getApiErrorMessage(error, 'fallback')).toBe('E-mail inválido');
  });
});
