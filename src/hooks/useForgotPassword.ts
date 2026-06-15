import { useCallback, useState } from 'react';
import { FORGOT_PASSWORD_ERROR_MESSAGE } from '../constants/passwordRecovery';
import authApi from '../services/authApi';
import type { ForgotPasswordFormErrors } from '../types/auth';
import { getApiErrorMessage, logApiErrorInDev } from '../utils/apiError';
import { validateForgotPasswordForm } from '../utils/forgotPasswordValidation';

export function useForgotPassword(onSuccess?: (email: string) => void) {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = useCallback((field: keyof ForgotPasswordFormErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateForgotPasswordForm(email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authApi.esqueciSenha({ email: email.trim() });
      onSuccess?.(email.trim());
    } catch (error) {
      logApiErrorInDev('Forgot Password', error);
      setErrors({
        general: getApiErrorMessage(error, FORGOT_PASSWORD_ERROR_MESSAGE),
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, onSuccess]);

  const reset = useCallback(() => {
    setEmail('');
    setErrors({});
    setIsLoading(false);
  }, []);

  return {
    email,
    setEmail,
    errors,
    isLoading,
    handleSubmit,
    clearFieldError,
    reset,
  };
}
