import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {
  AuthCheckbox,
  AuthHeroSection,
  AuthScreenLayout,
  AuthTextField,
  CONFIRM_PASSWORD_PLACEHOLDER,
  PrimaryButton,
} from '../../components';
import { useRegister } from '../../hooks/useRegister';
import { useAuthNavigation } from '../../navigation/hooks';
import { authLayoutStyles } from '../../styles/authLayout';
import { styles } from './styles';

export default function RegisterScreen() {
  const navigation = useAuthNavigation();

  const handleRegisterSuccess = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  }, [navigation]);

  const {
    name,
    setName,
    email,
    setEmail,
    university,
    setUniversity,
    enrollmentId,
    setEnrollmentId,
    cpf,
    setCpf,
    birthDate,
    setBirthDate,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptedTerms,
    setAcceptedTerms,
    errors,
    isLoading,
    handleRegister,
    clearFieldError,
  } = useRegister(handleRegisterSuccess);

  const handleTermsToggle = (value: boolean) => {
    setAcceptedTerms(value);
    clearFieldError('acceptedTerms');
  };

  const formDisabled = isLoading;

  return (
    <AuthScreenLayout>
      <AuthHeroSection
        badgeLabel="Crie sua conta"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.formSection}>
        <Text style={authLayoutStyles.formTitle} accessibilityRole="header">
          Criar conta grátis
        </Text>

        <View style={authLayoutStyles.loginPrompt}>
          <Text style={authLayoutStyles.loginPromptText}>
            Já tem uma conta?{' '}
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="link"
            accessibilityLabel="Faça login"
            disabled={formDisabled}
          >
            <Text style={authLayoutStyles.loginPromptLink}>Faça login</Text>
          </Pressable>
        </View>

        {errors.general && (
          <Text style={authLayoutStyles.generalError} accessibilityRole="alert">
            {errors.general}
          </Text>
        )}

        <AuthTextField
          label="Nome completo"
          icon="user"
          placeholder="Seu nome completo"
          value={name}
          onChangeText={(text) => {
            setName(text);
            clearFieldError('name');
          }}
          error={errors.name}
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          editable={!formDisabled}
        />

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
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          editable={!formDisabled}
        />

        <AuthTextField
          label="Universidade"
          icon="book"
          placeholder="Nome da sua universidade"
          value={university}
          onChangeText={(text) => {
            setUniversity(text);
            clearFieldError('university');
          }}
          error={errors.university}
          autoCapitalize="words"
          returnKeyType="next"
          editable={!formDisabled}
        />

        <AuthTextField
          label="Matrícula"
          icon="hash"
          placeholder="Número da matrícula"
          value={enrollmentId}
          onChangeText={(text) => {
            setEnrollmentId(text);
            clearFieldError('enrollmentId');
          }}
          error={errors.enrollmentId}
          optional
          returnKeyType="next"
          editable={!formDisabled}
        />

        <AuthTextField
          label="CPF"
          icon="hash"
          placeholder="Apenas números"
          value={cpf}
          onChangeText={(text) => {
            setCpf(text);
            clearFieldError('cpf');
          }}
          error={errors.cpf}
          keyboardType="numeric"
          returnKeyType="next"
          editable={!formDisabled}
        />

        <AuthTextField
          label="Data de Nascimento"
          icon="calendar"
          placeholder="DD/MM/AAAA"
          value={birthDate}
          onChangeText={(text) => {
            const cleaned = text.replace(/\D/g, '');
            let masked = cleaned;
            if (cleaned.length > 2) masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
            if (cleaned.length > 4) masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
            setBirthDate(masked);
            clearFieldError('birthDate');
          }}
          error={errors.birthDate}
          keyboardType="numeric"
          returnKeyType="next"
          editable={!formDisabled}
          maxLength={10}
        />

        <AuthTextField
          label="Senha"
          icon="lock"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearFieldError('password');
          }}
          error={errors.password}
          isPassword
          autoComplete="password-new"
          textContentType="newPassword"
          returnKeyType="next"
          editable={!formDisabled}
        />

        <AuthTextField
          label="Confirmar senha"
          icon="lock"
          placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            clearFieldError('confirmPassword');
          }}
          error={errors.confirmPassword}
          isPassword
          autoComplete="password-new"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          editable={!formDisabled}
        />

        <AuthCheckbox
          checked={acceptedTerms}
          onToggle={handleTermsToggle}
          error={errors.acceptedTerms}
          onPressTerms={() => console.log('Abrir Termos de Uso')}
          onPressPrivacy={() => console.log('Abrir Política de Privacidade')}
          disabled={formDisabled}
        />

        <PrimaryButton
          label="Criar conta grátis"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          accessibilityLabel={
            isLoading ? 'Criando conta, aguarde' : 'Criar conta grátis'
          }
        />
      </View>
    </AuthScreenLayout>
  );
}
