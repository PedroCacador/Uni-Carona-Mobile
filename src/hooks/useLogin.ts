import { useCallback, useState } from 'react';
import type { LoginFormErrors } from '../types/auth';
import { validateLoginForm } from '../utils/validation';
import api from '../services/api';

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
      const response = await api.post('/auth/login', { email, senha: password });
      console.log('Login realizado', response.data);
      onSuccess?.();
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Não foi possível entrar. Verifique suas credenciais.' });
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
