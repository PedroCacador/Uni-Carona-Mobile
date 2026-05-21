export type AccountType = 'passenger' | 'driver';

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  university?: string;
  enrollmentId?: string;
  password?: string;
  confirmPassword?: string;
  accountType?: string;
  acceptedTerms?: string;
  general?: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  university: string;
  enrollmentId: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType | null;
  acceptedTerms: boolean;
}
