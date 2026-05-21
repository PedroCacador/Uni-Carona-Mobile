import { MIN_PASSWORD_LENGTH } from '../constants/auth';
import type { LoginFormErrors } from '../types/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function validateLoginForm(
  email: string,
  password: string,
): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = 'Informe seu e-mail';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'E-mail inválido';
  }

  if (!password) {
    errors.password = 'Informe sua senha';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }

  return errors;
}
