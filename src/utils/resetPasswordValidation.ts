import { MIN_PASSWORD_LENGTH } from '../constants/auth';
import type { ResetPasswordFormErrors } from '../types/auth';

export function validateResetPasswordForm(
  password: string,
  confirmPassword: string,
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    errors.password = 'A senha deve ter no mínimo 6 caracteres';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem';
  }

  return errors;
}
