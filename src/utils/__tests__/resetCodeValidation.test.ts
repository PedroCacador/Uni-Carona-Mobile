import { validateResetCodeForm } from '../resetCodeValidation';

describe('validateResetCodeForm', () => {
  it('exige código preenchido', () => {
    expect(validateResetCodeForm('')).toEqual({
      codigo: 'Informe o código enviado para o seu e-mail.',
    });
  });

  it('aceita qualquer código não vazio', () => {
    expect(validateResetCodeForm('123456')).toEqual({});
    expect(validateResetCodeForm('abc-token')).toEqual({});
  });
});
