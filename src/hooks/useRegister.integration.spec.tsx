import React from 'react';
import TestRenderer from 'react-test-renderer';
import { useRegister } from './useRegister';
import api from '../services/api';

// Mocks para isolar os serviços externos
jest.mock('../services/api');

// Função auxiliar para renderizar hooks sem precisar da React Native Testing Library
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

describe('useRegister Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve realizar o fluxo completo de registro e chamar onSuccess', async () => {
    const mockOnSuccess = jest.fn();

    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { id: '123', email: 'joao@dominio.com' }
    });

    const { result } = renderHook(() => useRegister(mockOnSuccess));

    // Preenche os campos
    act(() => {
      result.current.setName('João da Silva');
      result.current.setEmail('joao@dominio.com');
      result.current.setUniversity('Universidade Teste');
      result.current.setEnrollmentId('123456');
      result.current.setCpf('52998224725');
      result.current.setBirthDate('10/10/1995');
      result.current.setPassword('senhaSegura123');
      result.current.setConfirmPassword('senhaSegura123');
      result.current.setAcceptedTerms(true);
    });

    // Submete o form
    await act(async () => {
      await result.current.handleRegister();
    });

    // Asserções da integração
    expect(api.post).toHaveBeenCalledWith('/usuarios', {
      nome: 'João da Silva',
      email: 'joao@dominio.com',
      senha: 'senhaSegura123',
      curso: 'Universidade Teste',
      cpf: '52998224725',
      matricula: '123456',
      dataNascimento: new Date(1995, 9, 10).toISOString(),
    });
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.errors).toEqual({});
  });

  it('deve lidar com erros da API e atualizar o erro general', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'E-mail já está em uso' } }
    });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setName('João da Silva');
      result.current.setEmail('existente@dominio.com');
      result.current.setUniversity('Universidade Teste');
      result.current.setCpf('52998224725');
      result.current.setBirthDate('10/10/1995');
      result.current.setPassword('senhaSegura123');
      result.current.setConfirmPassword('senhaSegura123');
      result.current.setAcceptedTerms(true);
    });

    await act(async () => {
      await result.current.handleRegister();
    });

    expect(result.current.errors.general).toBe('E-mail já está em uso');
  });
});
