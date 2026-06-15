import { act, renderHook } from '../../test/renderHook';
import { AxiosError } from 'axios';
import { useValidateResetCode } from '../../hooks/useValidateResetCode';
import authApi from '../../services/authApi';

jest.mock('../../services/authApi', () => ({
  __esModule: true,
  default: {
    validarCodigo: jest.fn(),
    esqueciSenha: jest.fn(),
  },
}));

const mockedValidarCodigo = authApi.validarCodigo as jest.Mock;
const mockedEsqueciSenha = authApi.esqueciSenha as jest.Mock;
const email = 'usuario@email.com';

describe('useValidateResetCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não envia quando código está vazio', async () => {
    const { result } = renderHook(() => useValidateResetCode(email));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedValidarCodigo).not.toHaveBeenCalled();
    expect(result.current.errors.codigo).toBe(
      'Informe o código enviado para o seu e-mail.',
    );
  });

  it('chama onSuccess com token válido', async () => {
    mockedValidarCodigo.mockResolvedValue({ valid: true });
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useValidateResetCode(email, onSuccess));

    act(() => {
      result.current.setCodigo('123456');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedValidarCodigo).toHaveBeenCalledWith({
      email,
      codigo: '123456',
    });
    expect(onSuccess).toHaveBeenCalledWith('123456');
  });

  it('exibe erro da API para código inválido', async () => {
    const apiError = new AxiosError('Request failed');
    apiError.response = {
      status: 400,
      data: { message: 'Código inválido ou expirado' },
    } as AxiosError['response'];
    mockedValidarCodigo.mockRejectedValue(apiError);

    const { result } = renderHook(() => useValidateResetCode(email));

    act(() => {
      result.current.setCodigo('000000');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.errors.general).toBe('Código inválido ou expirado');
  });

  it('não reenvia enquanto contador está ativo', async () => {
    const { result } = renderHook(() => useValidateResetCode(email));

    await act(async () => {
      await result.current.handleResend();
    });

    expect(mockedEsqueciSenha).not.toHaveBeenCalled();
  });
});
