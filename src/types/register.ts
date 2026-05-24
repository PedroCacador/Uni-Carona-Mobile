export interface RegisterFormErrors {
  name?: string;
  email?: string;
  university?: string;
  enrollmentId?: string;
  cpf?: string;
  birthDate?: string;
  password?: string;
  confirmPassword?: string;
  acceptedTerms?: string;
  general?: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  university: string;
  enrollmentId: string;
  cpf: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}
