import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  ResetPasswordScreenParams,
  VerifyCodeScreenParams,
} from '../types/auth';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: VerifyCodeScreenParams;
  ResetPassword: ResetPasswordScreenParams;
};

export type MainTabParamList = {
  Início: undefined;
  Caronas: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
