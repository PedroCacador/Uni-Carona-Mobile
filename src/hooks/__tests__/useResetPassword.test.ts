import { act, renderHook } from '../../test/renderHook';
import { useResetPassword } from '../../hooks/useResetPassword';
import authApi from '../../services/authApi';

jest.mock('../../services/authApi', () => ({
  __esModule: true,
  default: {
    redefinirSenha: jest.fn(),
  },
}));

const mockedRedefinirSenha = authApi.redefinirSenha as jest.Mock;
const token = '123456';

describe('useResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não envia quando senhas não coincidem', async () => {
    const { result } = renderHook(() => useResetPassword(token));

    act(() => {
      result.current.setPassword('Senha123');
      result.current.setConfirmPassword('Senha456');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedRedefinirSenha).not.toHaveBeenCalled();
    expect(result.current.errors.confirmPassword).toBe('As senhas não coincidem');
  });

  it('define sucesso após redefinição', async () => {
    mockedRedefinirSenha.mockResolvedValue({
      message: 'Senha redefinida com sucesso!',
    });

    const { result } = renderHook(() => useResetPassword(token));

    act(() => {
      result.current.setPassword('NovaSenha123');
      result.current.setConfirmPassword('NovaSenha123');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockedRedefinirSenha).toHaveBeenCalledWith({
      token,
      novaSenha: 'NovaSenha123',
    });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.successMessage).toBe('Senha redefinida com sucesso!');
  });

  it('exibe erro da API em falha', async () => {
    mockedRedefinirSenha.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useResetPassword(token));

    act(() => {
      result.current.setPassword('NovaSenha123');
      result.current.setConfirmPassword('NovaSenha123');
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.errors.general).toBeTruthy();
  });
});
