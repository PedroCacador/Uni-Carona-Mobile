import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import {
  AccountTypeSelector,
  AuthCheckbox,
  AuthHeroSection,
  AuthScreenLayout,
  AuthTextField,
  CONFIRM_PASSWORD_PLACEHOLDER,
  PrimaryButton,
} from '../../components';
import { useRegister } from '../../hooks/useRegister';
import { useAuthNavigation } from '../../navigation/hooks';
import type { AccountType } from '../../types/register';
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
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    accountType,
    setAccountType,
    acceptedTerms,
    setAcceptedTerms,
    errors,
    isLoading,
    handleRegister,
    clearFieldError,
  } = useRegister(handleRegisterSuccess);

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    clearFieldError('accountType');
  };

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

        <AccountTypeSelector
          value={accountType}
          onChange={handleAccountTypeChange}
          error={errors.accountType}
        />

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
