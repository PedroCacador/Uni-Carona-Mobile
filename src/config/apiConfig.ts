const DEV_MISSING_ENV_MESSAGE =
  'EXPO_PUBLIC_API_URL não está definida. Copie .env.example para .env, configure o IP local da sua máquina e reinicie o Expo (npx expo start -c).';

const PROD_MISSING_ENV_MESSAGE = 'Configuração da API indisponível.';

const LOCALHOST_PATTERN = /localhost|127\.0\.0\.1/i;

function normalizeBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  const withProtocol =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `http://${trimmed}`;

  return withProtocol.replace(/\/+$/, '');
}

export function resolveApiBaseUrl(): string {
  const rawUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!rawUrl) {
    const message = __DEV__ ? DEV_MISSING_ENV_MESSAGE : PROD_MISSING_ENV_MESSAGE;
    throw new Error(message);
  }

  const baseUrl = normalizeBaseUrl(rawUrl);

  if (__DEV__ && LOCALHOST_PATTERN.test(baseUrl)) {
    console.warn(
      '[apiConfig] EXPO_PUBLIC_API_URL aponta para localhost. ' +
        'Em dispositivo físico, use o IP local da máquina na mesma rede Wi-Fi (ex.: http://192.168.x.x:3333).',
    );
  }

  return baseUrl;
}
