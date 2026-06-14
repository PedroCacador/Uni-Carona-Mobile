import { isValidEmail, validateLoginForm } from './validation';

describe('validation.ts (Unit Tests)', () => {
  describe('isValidEmail', () => {
    it('deve retornar true para e-mails válidos', () => {
      expect(isValidEmail('teste@teste.com')).toBe(true);
      expect(isValidEmail('usuario.nome@dominio.com.br')).toBe(true);
    });

    it('deve retornar false para e-mails inválidos', () => {
      expect(isValidEmail('teste@teste')).toBe(false);
      expect(isValidEmail('usuario.com')).toBe(false);
      expect(isValidEmail('usuario@.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('validateLoginForm', () => {
    it('deve retornar erro se o e-mail estiver vazio', () => {
      const errors = validateLoginForm('', 'senha123');
      expect(errors.email).toBe('Informe seu e-mail');
    });

    it('deve retornar erro se a senha estiver vazia', () => {
      const errors = validateLoginForm('teste@teste.com', '');
      expect(errors.password).toBe('Informe sua senha');
    });

    it('deve retornar erro se a senha for muito curta', () => {
      const errors = validateLoginForm('teste@teste.com', '12345');
      expect(errors.password).toMatch(/Senha deve ter pelo menos/);
    });

    it('não deve retornar erros se os dados forem válidos', () => {
      const errors = validateLoginForm('teste@teste.com', 'senha123');
      expect(errors).toEqual({});
    });
  });
});
