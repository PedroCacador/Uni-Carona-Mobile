import { useCallback, useState } from 'react';
import { AUTH_REQUEST_DELAY_MS } from '../constants/auth';
import type { LoginFormErrors } from '../types/auth';
import { validateLoginForm } from '../utils/validation';

export function useLogin(onSuccess?: () => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = useCallback((field: keyof LoginFormErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleLogin = useCallback(async () => {
    const validationErrors = validateLoginForm(email, password);
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
      console.log('Login realizado');
      onSuccess?.();
    } catch {
      setErrors({ general: 'Não foi possível entrar. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, onSuccess]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
    clearFieldError,
  };
}
