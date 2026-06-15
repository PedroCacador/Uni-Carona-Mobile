import React from 'react';
import { View, Text, Pressable } from 'react-native';
import {
  AuthHeroSection,
  AuthScreenLayout,
  AuthTextField,
  PrimaryButton,
} from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useLogin } from '../../hooks/useLogin';
import { useAuthNavigation } from '../../navigation/hooks';
import { styles } from './styles';

export default function LoginScreen() {
  const navigation = useAuthNavigation();
  const { signIn } = useAuth();

  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
    clearFieldError,
  } = useLogin(signIn);

  return (
    <AuthScreenLayout>
      <AuthHeroSection badgeLabel="Entrar na conta" />

      <View style={styles.form}>
        <Text style={styles.formTitle} accessibilityRole="header">
          Entrar
        </Text>
        <Text style={styles.formSubtitle}>
          Acesse sua conta para encontrar ou oferecer caronas.
        </Text>

        {errors.general && (
          <Text style={styles.generalError} accessibilityRole="alert">
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
          returnKeyType="next"
          editable={!isLoading}
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
          textContentType="password"
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          editable={!isLoading}
        />

        <Pressable
          style={styles.forgotLink}
          onPress={() => navigation.navigate('ForgotPassword')}
          accessibilityRole="link"
          accessibilityLabel="Esqueci minha senha"
          disabled={isLoading}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </Pressable>

        <PrimaryButton
          label="Entrar"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          accessibilityLabel={isLoading ? 'Entrando, aguarde' : 'Entrar'}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            accessibilityRole="link"
            accessibilityLabel="Criar conta"
            disabled={isLoading}
          >
            <Text style={styles.footerLink}>Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </AuthScreenLayout>
  );
}
