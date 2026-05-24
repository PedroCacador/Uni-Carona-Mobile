import { useCallback, useState } from 'react';
import type { RegisterFormErrors } from '../types/register';
import { validateRegisterForm } from '../utils/registerValidation';
import api from '../services/api';

export function useRegister(onSuccess?: () => void) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = useCallback((field: keyof RegisterFormErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleRegister = useCallback(async () => {
    const validationErrors = validateRegisterForm(
      name,
      email,
      university,
      enrollmentId,
      cpf,
      birthDate,
      password,
      confirmPassword,
      acceptedTerms,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const [day, month, year] = birthDate.split('/').map(Number);
      const dataNascimentoISO = new Date(year, month - 1, day).toISOString();

      const payload = {
        nome: name,
        email,
        senha: password,
        curso: university,
        cpf,
        matricula: enrollmentId || undefined,
        dataNascimento: dataNascimentoISO,
      };
      const response = await api.post('/usuarios', payload);
      console.log('Conta criada', response.data);
      onSuccess?.();
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || 'Não foi possível criar a conta. Verifique os dados e tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    name,
    email,
    university,
    enrollmentId,
    cpf,
    birthDate,
    password,
    confirmPassword,
    acceptedTerms,
    onSuccess,
  ]);

  return {
    name,
    setName,
    email,
    setEmail,
    university,
    setUniversity,
    enrollmentId,
    setEnrollmentId,
    cpf,
    setCpf,
    birthDate,
    setBirthDate,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptedTerms,
    setAcceptedTerms,
    errors,
    isLoading,
    handleRegister,
    clearFieldError,
  };
}
