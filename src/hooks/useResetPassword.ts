import { useCallback, useState } from 'react';
import {
  RESET_PASSWORD_ERROR_MESSAGE,
  RESET_PASSWORD_SUCCESS_MESSAGE,
} from '../constants/passwordRecovery';
import authApi from '../services/authApi';
import type { ResetPasswordFormErrors } from '../types/auth';
import { getApiErrorMessage, logApiErrorInDev } from '../utils/apiError';
import { validateResetPasswordForm } from '../utils/resetPasswordValidation';

export function useResetPassword(
  token: string,
  onSuccess?: () => void,
) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const clearFieldError = useCallback((field: keyof ResetPasswordFormErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateResetPasswordForm(password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await authApi.redefinirSenha({
        token,
        novaSenha: password,
      });
      setSuccessMessage(response.message || RESET_PASSWORD_SUCCESS_MESSAGE);
      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      logApiErrorInDev('Reset Password', error);
      setErrors({
        general: getApiErrorMessage(error, RESET_PASSWORD_ERROR_MESSAGE),
      });
    } finally {
      setIsLoading(false);
    }
  }, [confirmPassword, onSuccess, password, token]);

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    isLoading,
    isSuccess,
    successMessage,
    handleSubmit,
    clearFieldError,
  };
}
