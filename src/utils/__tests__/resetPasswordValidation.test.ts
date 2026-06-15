import { validateResetPasswordForm } from '../resetPasswordValidation';

describe('validateResetPasswordForm', () => {
  it('exige mínimo de 6 caracteres', () => {
    expect(validateResetPasswordForm('', '')).toEqual({
      password: 'A senha deve ter no mínimo 6 caracteres',
    });
  });

  it('exige senhas iguais', () => {
    expect(validateResetPasswordForm('Senha123', 'Senha456')).toEqual({
      confirmPassword: 'As senhas não coincidem',
    });
  });

  it('aceita senhas válidas', () => {
    expect(validateResetPasswordForm('Senha123', 'Senha123')).toEqual({});
  });
});
