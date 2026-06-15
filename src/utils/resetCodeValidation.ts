import type { VerifyCodeFormErrors } from '../types/auth';

export function validateResetCodeForm(codigo: string): VerifyCodeFormErrors {
  const errors: VerifyCodeFormErrors = {};
  const trimmed = codigo.trim();

  if (!trimmed) {
    errors.codigo = 'Informe o código enviado para o seu e-mail.';
  }

  return errors;
}
