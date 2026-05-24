import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@unicarona_auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao carregar estado de autenticação', error);
      } finally {
        setIsInitializing(false);
      }
    };
    loadAuth();
  }, []);

  const signIn = useCallback(async () => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar estado de autenticação', error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao remover estado de autenticação', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      signIn,
      signOut,
    }),
    [isAuthenticated, signIn, signOut],
  );

  if (isInitializing) {
    return null; // Pode ser substituído por um Splash Screen se necessário
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
