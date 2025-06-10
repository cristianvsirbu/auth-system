import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthContextType, AuthState, User } from '../types/auth';

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedSession = localStorage.getItem('auth_session');
        const savedUser = localStorage.getItem('auth_user');

        if (savedSession && savedUser) {
          setState({
            user: JSON.parse(savedUser),
            session: savedSession,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Failed to load authentication state:', error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadSession();
  }, []);

  const saveSession = (session: string, user: User) => {
    localStorage.setItem('auth_session', session);
    localStorage.setItem('auth_user', JSON.stringify(user));

    setState({
      user,
      session,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  };

  const login = async (emailOrCode: string, pincode?: string) => {
    // Implementation will come later
    console.log('Login called with', emailOrCode, pincode);
  };

  const registerWithEmail = async (email: string, lang = 'en') => {
    // Implementation will come later
    console.log('Register with email', email, lang);
  };

  const registerAnonymously = async () => {
    // Implementation will come later
    console.log('Register anonymously');
    return '';
  };

  const loginWithGoogle = async (code: string, redirectUri: string) => {
    // Implementation will come later
    console.log('Login with Google', code, redirectUri);
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  const clearError = () => setState((prev) => ({ ...prev, error: null }));

  const value: AuthContextType = {
    ...state,
    login,
    registerWithEmail,
    registerAnonymously,
    loginWithGoogle,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
