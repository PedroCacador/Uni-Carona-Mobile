import { act, renderHook } from '../../test/renderHook';
import { AxiosError } from 'axios';
import { FORGOT_PASSWORD_ERROR_MESSAGE } from '../../constants/passwordRecovery';
import { CONNECTION_ERROR_MESSAGE } from '../../utils/apiError';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import authApi from '../../services/authApi';

jest.mock('../../services/authApi', () => ({
  __esModule: true,
  default: {
    esqueciSenha: jest.fn(),
  },
}));

const mockedEsqueciSenha = authApi.esqueciSenha as jest.Mock;

describe('useForgotPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não envia quando e-mail é inválido', async () => {
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedEsqueciSenha).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Por favor, informe seu e-mail.');
  });

  it('chama onSuccess após envio correto', async () => {
    mockedEsqueciSenha.mockResolvedValue({ message: 'ok' });
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useForgotPassword(onSuccess));

    act(() => {
      result.current.setEmail('usuario@email.com');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedEsqueciSenha).toHaveBeenCalledWith({ email: 'usuario@email.com' });
    expect(onSuccess).toHaveBeenCalledWith('usuario@email.com');
    expect(result.current.isLoading).toBe(false);
  });

  it('exibe erro amigável em falha de API', async () => {
    mockedEsqueciSenha.mockRejectedValue(new Error('network'));

    const { result } = renderHook(() => useForgotPassword());

    act(() => {
      result.current.setEmail('usuario@email.com');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.general).toBe(FORGOT_PASSWORD_ERROR_MESSAGE);
    expect(result.current.isLoading).toBe(false);
  });

  it('exibe mensagem de rede quando não há resposta', async () => {
    const networkError = new AxiosError('Network Error');
    networkError.response = undefined;
    mockedEsqueciSenha.mockRejectedValue(networkError);

    const { result } = renderHook(() => useForgotPassword());

    act(() => {
      result.current.setEmail('usuario@email.com');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.general).toBe(CONNECTION_ERROR_MESSAGE);
  });
});
