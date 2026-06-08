import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from './caronaApi';

const STORAGE_KEYS = {
  auth: '@unicarona_auth',
  token: '@unicarona_token',
  user: '@unicarona_user',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

async function setJson<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

async function getJson<T>(key: StorageKey): Promise<T | null> {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEYS[key]);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch (error) {
    await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    console.error('Erro ao ler dados locais', error);
    return null;
  }
}

export const localDatabase = {
  setAuthenticated: async (value: boolean): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.auth, String(value));
  },

  isAuthenticated: async (): Promise<boolean> => {
    const storedAuth = await AsyncStorage.getItem(STORAGE_KEYS.auth);
    return storedAuth === 'true';
  },

  setToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.token, token);
  },

  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(STORAGE_KEYS.token);
  },

  setUser: async (user: Usuario): Promise<void> => {
    await setJson('user', user);
  },

  getUser: async <TUser extends Partial<Usuario> = Usuario>(): Promise<TUser | null> => {
    return getJson<TUser>('user');
  },

  clearSession: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.auth,
      STORAGE_KEYS.token,
      STORAGE_KEYS.user,
    ]);
  },
};

export default localDatabase;
