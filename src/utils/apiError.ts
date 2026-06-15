import { isAxiosError, type AxiosError } from 'axios';

export const CONNECTION_ERROR_MESSAGE =
  'Não foi possível conectar ao servidor. Verifique sua rede e se o backend está acessível.';

export const TIMEOUT_ERROR_MESSAGE =
  'A requisição demorou demais. Tente novamente.';

const CONNECTION_ERROR_CODES = new Set([
  'ERR_NETWORK',
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'ERR_CONNECTION',
]);

function isConnectionFailure(error: AxiosError): boolean {
  if (error.response) {
    return false;
  }

  if (error.code && CONNECTION_ERROR_CODES.has(error.code)) {
    return true;
  }

  return error.message === 'Network Error';
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) {
    return fallback;
  }

  if (error.code === 'ECONNABORTED') {
    return TIMEOUT_ERROR_MESSAGE;
  }

  if (isConnectionFailure(error)) {
    return CONNECTION_ERROR_MESSAGE;
  }

  if (!error.response) {
    return CONNECTION_ERROR_MESSAGE;
  }

  const data = error.response.data as { message?: string } | undefined;
  return data?.message || fallback;
}

export function logApiErrorInDev(context: string, error: unknown): void {
  if (!__DEV__) {
    return;
  }

  if (isAxiosError(error)) {
    console.log(`${context} Error:`, {
      url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });
    return;
  }

  console.log(`${context} Error:`, error);
}
