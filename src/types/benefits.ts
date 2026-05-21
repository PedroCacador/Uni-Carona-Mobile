export interface BenefitItem {
  id: string;
  step: number;
  text: string;
}

export const AUTH_BENEFITS: BenefitItem[] = [
  {
    id: 'create-account',
    step: 1,
    text: 'Crie sua conta em 2 minutos',
  },
  {
    id: 'search-rides',
    step: 2,
    text: 'Busque caronas na sua rota',
  },
  {
    id: 'travel-safe',
    step: 3,
    text: 'Viaje com segurança',
  },
];
