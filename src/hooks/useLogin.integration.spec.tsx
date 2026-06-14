import React from 'react';
import TestRenderer from 'react-test-renderer';
import { useLogin } from './useLogin';
import authApi from '../services/authApi';
import localDatabase from '../services/localDatabase';

// Mocks para isolar os serviços externos
jest.mock('../services/authApi');
jest.mock('../services/localDatabase');

function renderHook<TResult, TProps>(hook: (props: TProps) => TResult, initialProps?: TProps) {
  let result: any = {};
  function TestComponent({ hookProps }: { hookProps: any }) {
    result.current = hook(hookProps);
    return null;
  }
  let testRenderer: any;
  TestRenderer.act(() => {
    testRenderer = TestRenderer.create(<TestComponent hookProps={initialProps} />);
  });
  return {
    result,
    rerender: (newProps: any) => {
      TestRenderer.act(() => {
        testRenderer.update(<TestComponent hookProps={newProps} />);
      });
    }
  };
}

const { act } = TestRenderer;

describe('useLogin Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve validar campos vazios e atualizar estado de erros antes de chamar a API', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.errors).toHaveProperty('email');
    expect(result.current.errors).toHaveProperty('password');
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('deve realizar o fluxo completo de login salvando token e chamando onSuccess', async () => {
    const mockOnSuccess = jest.fn();
    const mockToken = 'jwt-token-fake';
    const mockUser = { id: 'user-1', nome: 'Teste' };

    (authApi.login as jest.Mock).mockResolvedValueOnce({
      token: mockToken,
      usuario: mockUser,
    });

    const { result } = renderHook(() => useLogin(mockOnSuccess));

    act(() => {
      result.current.setEmail('teste@email.com');
      result.current.setPassword('senha123');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(authApi.login).toHaveBeenCalledWith({ email: 'teste@email.com', senha: 'senha123' });
    expect(localDatabase.setToken).toHaveBeenCalledWith(mockToken);
    expect(localDatabase.setUser).toHaveBeenCalledWith(mockUser);
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.errors).toEqual({});
  });

  it('deve preencher erros de general caso a API retorne um erro (ex: credenciais inválidas)', async () => {
    (authApi.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Senha incorreta' } },
    });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setEmail('teste@email.com');
      result.current.setPassword('senha-errada');
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(result.current.errors.general).toBe('Senha incorreta');
    expect(localDatabase.setToken).not.toHaveBeenCalled();
  });
});
