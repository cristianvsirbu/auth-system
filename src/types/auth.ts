export interface User {
  email?: string;
  provider?: string;
  loginCode?: string;
  name?: string;
  picture?: string;
}

export interface SessionData {
  session: string;
}

export interface AuthState {
  user: User | null;
  session: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (emailOrCode: string, pincode?: number) => Promise<void>;
  registerWithEmail: (email: string, lang?: string) => Promise<void>;
  registerAnonymously: () => Promise<string>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
