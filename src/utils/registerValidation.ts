import { MIN_PASSWORD_LENGTH } from '../constants/auth';
import type { RegisterFormErrors } from '../types/register';
import { isValidEmail } from './validation';

export function isValidCPF(cpf: string): boolean {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfArray = cpf.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += cpfArray[i] * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== cpfArray[9]) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += cpfArray[i] * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== cpfArray[10]) return false;
  return true;
}

export function isValidDate(dateStr: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

const MIN_NAME_LENGTH = 3;
const MIN_UNIVERSITY_LENGTH = 2;

export function validateRegisterForm(
  name: string,
  email: string,
  university: string,
  enrollmentId: string,
  cpf: string,
  birthDate: string,
  password: string,
  confirmPassword: string,
  acceptedTerms: boolean,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedUniversity = university.trim();
  const trimmedEnrollment = enrollmentId.trim();
  const trimmedCpf = cpf.trim();
  const trimmedBirthDate = birthDate.trim();

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

  if (!trimmedCpf) {
    errors.cpf = 'Informe seu CPF';
  } else if (!isValidCPF(trimmedCpf)) {
    errors.cpf = 'CPF inválido';
  }

  if (!trimmedBirthDate) {
    errors.birthDate = 'Informe sua data de nascimento';
  } else if (!isValidDate(trimmedBirthDate)) {
    errors.birthDate = 'Data de nascimento inválida';
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

  if (!acceptedTerms) {
    errors.acceptedTerms =
      'Você precisa aceitar os Termos de Uso e a Política de Privacidade';
  }

  return errors;
}
