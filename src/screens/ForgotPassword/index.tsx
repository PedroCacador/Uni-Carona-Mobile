import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  AuthHeroSection,
  AuthScreenLayout,
  AuthTextField,
  PrimaryButton,
} from '../../components';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { useAuthNavigation } from '../../navigation/hooks';
import { authLayoutStyles } from '../../styles/authLayout';
import { styles } from './styles';

export default function ForgotPasswordScreen() {
  const navigation = useAuthNavigation();
  const { email, setEmail, errors, isLoading, handleSubmit, clearFieldError } =
    useForgotPassword((submittedEmail) => {
      navigation.navigate('VerifyCode', { email: submittedEmail, flash: true });
    });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthScreenLayout>
      <AuthHeroSection
        badgeLabel="Recuperação de conta"
        subtitle="Recupere o acesso à sua conta de forma rápida e segura, sem complicações."
        showBackButton
        onBackPress={handleBack}
      />

      <View style={styles.container}>
        <Text style={authLayoutStyles.formTitle} accessibilityRole="header">
          Recuperar senha
        </Text>

        <Text style={styles.description}>
          Informe seu e-mail para receber as instruções de recuperação.
        </Text>

        {errors.general && (
          <Text style={authLayoutStyles.generalError} accessibilityRole="alert">
            {errors.general}
          </Text>
        )}

        <AuthTextField
          label="E-mail"
          icon="mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearFieldError('email');
          }}
          error={errors.email}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
          accessibilityLabel="E-mail"
        />

        <PrimaryButton
          label="Enviar código"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          accessibilityLabel={
            isLoading ? 'Enviando código, aguarde' : 'Enviar código de recuperação'
          }
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Lembrou a senha?</Text>
          <Pressable
            onPress={handleGoToLogin}
            accessibilityRole="link"
            accessibilityLabel="Faça login"
            disabled={isLoading}
          >
            <Text style={styles.footerLink}>Faça login</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
