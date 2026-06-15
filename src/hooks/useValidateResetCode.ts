import { useCallback, useEffect, useState } from 'react';
import {
  CODE_RESENT_MESSAGE,
  FORGOT_PASSWORD_ERROR_MESSAGE,
  RESEND_CODE_SECONDS,
  VALIDATE_CODE_ERROR_MESSAGE,
} from '../constants/passwordRecovery';
import authApi from '../services/authApi';
import type { VerifyCodeFormErrors } from '../types/auth';
import { getApiErrorMessage, logApiErrorInDev } from '../utils/apiError';
import { validateResetCodeForm } from '../utils/resetCodeValidation';

export function useValidateResetCode(
  email: string,
  onSuccess?: (token: string) => void,
) {
  const [codigo, setCodigo] = useState('');
  const [errors, setErrors] = useState<VerifyCodeFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCounter, setResendCounter] = useState(RESEND_CODE_SECONDS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null,
  );

  useEffect(() => {
    if (resendCounter <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCounter((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCounter]);

  const clearFieldError = useCallback((field: keyof VerifyCodeFormErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleCodigoChange = useCallback(
    (value: string) => {
      setCodigo(value.slice(0, 80));
      clearFieldError('codigo');
      if (errors.general) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.general;
          return next;
        });
      }
    },
    [clearFieldError, errors.general],
  );

  const handleSubmit = useCallback(async () => {
    if (isLoading) {
      return;
    }

    const validationErrors = validateResetCodeForm(codigo);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await authApi.validarCodigo({ email, codigo: codigo.trim() });
      onSuccess?.(codigo.trim());
    } catch (error) {
      logApiErrorInDev('Validate Reset Code', error);
      setErrors({
        general: getApiErrorMessage(error, VALIDATE_CODE_ERROR_MESSAGE),
      });
    } finally {
      setIsLoading(false);
    }
  }, [codigo, email, isLoading, onSuccess]);

  const handleResend = useCallback(async () => {
    if (resendCounter > 0 || isResending || !email) {
      return;
    }

    setIsResending(true);

    try {
      await authApi.esqueciSenha({ email });
      setResendCounter(RESEND_CODE_SECONDS);
      setToast({ message: CODE_RESENT_MESSAGE, type: 'success' });
    } catch (error) {
      logApiErrorInDev('Resend Code', error);
      setToast({
        message: getApiErrorMessage(error, FORGOT_PASSWORD_ERROR_MESSAGE),
        type: 'error',
      });
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, resendCounter]);

  return {
    codigo,
    setCodigo: handleCodigoChange,
    errors,
    isLoading,
    isResending,
    resendCounter,
    toast,
    setToast,
    handleSubmit,
    handleResend,
    clearFieldError,
  };
}
