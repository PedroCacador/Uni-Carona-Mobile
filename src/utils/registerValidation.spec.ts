import { isValidCPF, isValidDate, validateRegisterForm } from './registerValidation';

describe('registerValidation.ts (Unit Tests)', () => {
  describe('isValidCPF', () => {
    it('deve retornar true para CPFs válidos', () => {
      // CPF válido mockado
      expect(isValidCPF('52998224725')).toBe(true);
      expect(isValidCPF('11144477735')).toBe(true);
    });

    it('deve retornar false para CPFs inválidos ou sequenciais', () => {
      expect(isValidCPF('11111111111')).toBe(false);
      expect(isValidCPF('12345678901')).toBe(false);
      expect(isValidCPF('123')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('deve retornar true para datas válidas', () => {
      expect(isValidDate('15/10/1990')).toBe(true);
      expect(isValidDate('29/02/2024')).toBe(true); // Ano bissexto
    });

    it('deve retornar false para datas inválidas', () => {
      expect(isValidDate('31/02/2023')).toBe(false); // Fevereiro não tem 31
      expect(isValidDate('15/13/1990')).toBe(false); // Mês inválido
      expect(isValidDate('15-10-1990')).toBe(false); // Formato errado
    });
  });

  describe('validateRegisterForm', () => {
    it('deve retornar erro para campos obrigatórios não preenchidos', () => {
      const errors = validateRegisterForm('', '', '', '', '', '', '', '', false);
      
      expect(errors.name).toBe('Informe seu nome completo');
      expect(errors.email).toBe('Informe seu e-mail');
      expect(errors.university).toBe('Informe sua universidade');
      expect(errors.cpf).toBe('Informe seu CPF');
      expect(errors.birthDate).toBe('Informe sua data de nascimento');
      expect(errors.password).toBe('Informe sua senha');
      expect(errors.confirmPassword).toBe('Confirme sua senha');
      expect(errors.acceptedTerms).toBe('Você precisa aceitar os Termos de Uso e a Política de Privacidade');
    });

    it('não deve retornar erros se tudo estiver correto', () => {
      const errors = validateRegisterForm(
        'João da Silva',
        'joao@dominio.com',
        'Universidade Teste',
        '123456',
        '52998224725',
        '10/10/1995',
        'senhaSegura123',
        'senhaSegura123',
        true
      );
      
      expect(errors).toEqual({});
    });
  });
});
