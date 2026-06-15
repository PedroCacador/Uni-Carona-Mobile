export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  general?: string;
}

export interface VerifyCodeFormErrors {
  codigo?: string;
  general?: string;
}

export interface ResetPasswordFormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export type VerifyCodeScreenParams = {
  email: string;
  flash?: boolean;
};

export type ResetPasswordScreenParams = {
  email: string;
  token: string;
};
