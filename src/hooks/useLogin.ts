import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoginFormErrors } from '../types/auth';
import { validateLoginForm } from '../utils/validation';
import authApi from '../services/authApi';

const USER_STORAGE_KEY = '@unicarona_user';

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
      const response = await authApi.login({ email, senha: password });
      const { token } = response || {};
      const usuario = response?.usuario;
      if (token) {
        await AsyncStorage.setItem('@unicarona_token', token);
      }
      if (usuario?.id) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuario));
      }
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
