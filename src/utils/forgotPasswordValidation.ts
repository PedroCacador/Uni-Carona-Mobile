import type { ForgotPasswordFormErrors } from '../types/auth';
import { isValidEmail } from './validation';

export function validateForgotPasswordForm(
  email: string,
): ForgotPasswordFormErrors {
  const errors: ForgotPasswordFormErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = 'Por favor, informe seu e-mail.';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'Por favor, insira um e-mail válido.';
  }

  return errors;
}
