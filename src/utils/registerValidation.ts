import { MIN_PASSWORD_LENGTH } from '../constants/auth';
import type { AccountType, RegisterFormErrors } from '../types/register';
import { isValidEmail } from './validation';

const MIN_NAME_LENGTH = 3;
const MIN_UNIVERSITY_LENGTH = 2;

export function validateRegisterForm(
  name: string,
  email: string,
  university: string,
  enrollmentId: string,
  password: string,
  confirmPassword: string,
  accountType: AccountType | null,
  acceptedTerms: boolean,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedUniversity = university.trim();
  const trimmedEnrollment = enrollmentId.trim();

  if (!trimmedName) {
    errors.name = 'Informe seu nome completo';
  } else if (trimmedName.length < MIN_NAME_LENGTH) {
    errors.name = 'Nome deve ter pelo menos 3 caracteres';
  }

  if (!trimmedEmail) {
    errors.email = 'Informe seu e-mail';
  } else if (!isValidEmail(trimmedEmail)) {
    errors.email = 'E-mail inválido';
  }

  if (!trimmedUniversity) {
    errors.university = 'Informe sua universidade';
  } else if (trimmedUniversity.length < MIN_UNIVERSITY_LENGTH) {
    errors.university = 'Universidade inválida';
  }

  if (trimmedEnrollment && trimmedEnrollment.length < 2) {
    errors.enrollmentId = 'Matrícula inválida';
  }

  if (!password) {
    errors.password = 'Informe sua senha';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirme sua senha';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'As senhas não coincidem';
  }

  if (!accountType) {
    errors.accountType = 'Selecione o tipo de conta';
  }

  if (!acceptedTerms) {
    errors.acceptedTerms =
      'Você precisa aceitar os Termos de Uso e a Política de Privacidade';
  }

  return errors;
}
