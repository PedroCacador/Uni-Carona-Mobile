import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CommonActions, RouteProp, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import {
  AuthHeroSection,
  AuthScreenLayout,
  AuthTextField,
  AuthToast,
  CONFIRM_PASSWORD_PLACEHOLDER,
  PASSWORD_PLACEHOLDER,
  PrimaryButton,
} from '../../components';
import { LOGIN_REDIRECT_DELAY_MS } from '../../constants/passwordRecovery';
import { useResetPassword } from '../../hooks/useResetPassword';
import { useAuthNavigation } from '../../navigation/hooks';
import type { AuthStackParamList } from '../../navigation/types';
import { authLayoutStyles } from '../../styles/authLayout';
import { theme } from '../../theme';
import { styles } from './styles';

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useAuthNavigation();
  const route = useRoute<ResetPasswordRouteProp>();
  const { email, token } = route.params;

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null,
  );

  const {
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
  } = useResetPassword(token);

  useEffect(() => {
    if (isSuccess) {
      setToast({
        message: successMessage || 'Senha redefinida com sucesso!',
        type: 'success',
      });
    }
  }, [isSuccess, successMessage]);

  useEffect(() => {
    if (!token) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ForgotPassword' }],
        }),
      );
    }
  }, [navigation, token]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, LOGIN_REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isSuccess, navigation]);

  const handleBack = () => {
    navigation.navigate('VerifyCode', { email });
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthScreenLayout>
      {toast && (
        <AuthToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {!isSuccess && (
        <AuthHeroSection
          badgeLabel="Defina uma nova senha"
          subtitle="Crie uma senha forte e única para manter sua conta sempre protegida."
          showBackButton
          onBackPress={handleBack}
        />
      )}

      <View style={styles.container}>
        {isSuccess ? (
          <View style={styles.successContainer}>
            <View
              style={styles.successIconWrap}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Feather
                name="check-circle"
                size={40}
                color={theme.colors.success}
              />
            </View>

            <Text style={styles.successTitle} accessibilityRole="header">
              Senha redefinida!
            </Text>

            <Text style={styles.successDescription}>
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </Text>

            <PrimaryButton
              label="Ir para o login"
              onPress={handleBackToLogin}
              style={styles.successButton}
              accessibilityLabel="Ir para o login"
            />
          </View>
        ) : (
          <>
            <Text style={authLayoutStyles.formTitle} accessibilityRole="header">
              Redefinir senha
            </Text>

            <Text style={styles.description}>
              Escolha uma nova senha para a sua conta.
            </Text>

            {errors.general && (
              <Text
                style={authLayoutStyles.generalError}
                accessibilityRole="alert"
              >
                {errors.general}
              </Text>
            )}

            <AuthTextField
              label="Nova senha"
              icon="lock"
              placeholder={PASSWORD_PLACEHOLDER}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearFieldError('password');
              }}
              error={errors.password}
              isPassword
              textContentType="newPassword"
              autoComplete="password-new"
              returnKeyType="next"
              editable={!isLoading}
              accessibilityLabel="Nova senha"
            />

            <AuthTextField
              label="Confirmar nova senha"
              icon="lock"
              placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                clearFieldError('confirmPassword');
              }}
              error={errors.confirmPassword}
              isPassword
              textContentType="newPassword"
              autoComplete="password-new"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!isLoading}
              accessibilityLabel="Confirmar nova senha"
            />

            <PrimaryButton
              label="Redefinir senha"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              accessibilityLabel={
                isLoading ? 'Redefinindo senha, aguarde' : 'Redefinir senha'
              }
            />
          </>
        )}
      </View>
    </AuthScreenLayout>
  );
}
