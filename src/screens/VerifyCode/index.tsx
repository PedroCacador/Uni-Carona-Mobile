import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CommonActions, RouteProp, useRoute } from '@react-navigation/native';
import {
  AuthHeroSection,
  AuthScreenLayout,
  AuthTextField,
  AuthToast,
  PrimaryButton,
} from '../../components';
import { CODE_SENT_FLASH_MESSAGE, MAX_CODE_LENGTH } from '../../constants/passwordRecovery';
import { useValidateResetCode } from '../../hooks/useValidateResetCode';
import { useAuthNavigation } from '../../navigation/hooks';
import type { AuthStackParamList } from '../../navigation/types';
import { authLayoutStyles } from '../../styles/authLayout';
import { styles } from './styles';

type VerifyCodeRouteProp = RouteProp<AuthStackParamList, 'VerifyCode'>;

export default function VerifyCodeScreen() {
  const navigation = useAuthNavigation();
  const route = useRoute<VerifyCodeRouteProp>();
  const { email, flash } = route.params;

  const [flashToast, setFlashToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    flash ? { message: CODE_SENT_FLASH_MESSAGE, type: 'success' } : null,
  );

  const {
    codigo,
    setCodigo,
    errors,
    isLoading,
    isResending,
    resendCounter,
    toast,
    setToast,
    handleSubmit,
    handleResend,
  } = useValidateResetCode(email, (token) => {
    navigation.navigate('ResetPassword', { email, token });
  });

  useEffect(() => {
    if (!email) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'ForgotPassword' }],
        }),
      );
    }
  }, [email, navigation]);

  const activeToast = toast ?? flashToast;

  const handleBack = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <AuthScreenLayout>
      {activeToast && (
        <AuthToast
          message={activeToast.message}
          type={activeToast.type}
          onClose={() => {
            setToast(null);
            setFlashToast(null);
          }}
        />
      )}

      <AuthHeroSection
        badgeLabel="Verificação"
        subtitle="Confirme que é você inserindo o código de segurança enviado para o seu e-mail."
        showBackButton
        onBackPress={handleBack}
      />

      <View style={styles.container}>
        <Text style={authLayoutStyles.formTitle} accessibilityRole="header">
          Verificação
        </Text>

        <Text style={styles.description}>
          Digite o código enviado para
          {email ? (
            <Text style={styles.emailHighlight}> {email}</Text>
          ) : (
            ' seu e-mail'
          )}
          .
        </Text>

        {errors.general && (
          <Text style={authLayoutStyles.generalError} accessibilityRole="alert">
            {errors.general}
          </Text>
        )}

        <AuthTextField
          label="Código de verificação"
          icon="hash"
          placeholder="Cole ou digite o código"
          value={codigo}
          onChangeText={setCodigo}
          error={errors.codigo}
          autoComplete="one-time-code"
          maxLength={MAX_CODE_LENGTH}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
          accessibilityLabel="Código de verificação"
        />

        <PrimaryButton
          label="Continuar"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          accessibilityLabel={isLoading ? 'Verificando código, aguarde' : 'Continuar'}
        />

        <View style={styles.resendSection}>
          <Text style={styles.resendText}>Não recebeu?</Text>
          {resendCounter > 0 ? (
            <Text style={styles.resendCounter} accessibilityLiveRegion="polite">
              Reenviar em {resendCounter}s
            </Text>
          ) : (
            <Pressable
              style={styles.resendButton}
              onPress={handleResend}
              disabled={isResending}
              accessibilityRole="button"
              accessibilityLabel="Reenviar código"
            >
              <Text style={styles.resendButtonText}>
                {isResending ? 'Reenviando...' : 'Reenviar código'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </AuthScreenLayout>
  );
}
