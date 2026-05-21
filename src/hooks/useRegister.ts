import { useCallback, useState } from 'react';
import { AUTH_REQUEST_DELAY_MS } from '../constants/auth';
import type { AccountType, RegisterFormErrors } from '../types/register';
import { validateRegisterForm } from '../utils/registerValidation';

export function useRegister(onSuccess?: () => void) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
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
      password,
      confirmPassword,
      accountType,
      acceptedTerms,
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await new Promise<void>((resolve) =>
        setTimeout(resolve, AUTH_REQUEST_DELAY_MS),
      );
      console.log('Conta criada');
      onSuccess?.();
    } catch {
      setErrors({
        general: 'Não foi possível criar a conta. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    name,
    email,
    university,
    enrollmentId,
    password,
    confirmPassword,
    accountType,
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
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    accountType,
    setAccountType,
    acceptedTerms,
    setAcceptedTerms,
    errors,
    isLoading,
    handleRegister,
    clearFieldError,
  };
}
