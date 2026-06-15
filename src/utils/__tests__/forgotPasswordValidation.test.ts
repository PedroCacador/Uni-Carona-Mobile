import { validateForgotPasswordForm } from '../forgotPasswordValidation';

describe('validateForgotPasswordForm', () => {
  it('retorna erro quando e-mail está vazio', () => {
    expect(validateForgotPasswordForm('')).toEqual({
      email: 'Por favor, informe seu e-mail.',
    });
  });

  it('retorna erro quando e-mail é inválido', () => {
    expect(validateForgotPasswordForm('email-invalido')).toEqual({
      email: 'Por favor, insira um e-mail válido.',
    });
  });

  it('retorna objeto vazio quando e-mail é válido', () => {
    expect(validateForgotPasswordForm('usuario@email.com')).toEqual({});
  });

  it('aceita e-mail com espaços nas bordas', () => {
    expect(validateForgotPasswordForm('  usuario@email.com  ')).toEqual({});
  });
});
