import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import localDatabase from '../services/localDatabase';

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
        const storedAuth = await localDatabase.isAuthenticated();
        if (storedAuth) {
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
      await localDatabase.setAuthenticated(true);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar estado de autenticação', error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await localDatabase.clearSession();
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
