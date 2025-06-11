import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthContextType, AuthState, User } from '../types/auth';

  const AuthContext = createContext<AuthContextType | null>(null);
  
  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
      user: null,
      session: null,
      isAuthenticated: false,
      loading: true,
      error: null
    });
  
    // Load session from localStorage on mount
    useEffect(() => {
      const loadSession = async () => {
        try {
          const savedSession = localStorage.getItem("auth_session");
          const savedUser = localStorage.getItem("auth_user");
          
          if (savedSession && savedUser) {
            setState({
              user: JSON.parse(savedUser),
              session: savedSession,
              isAuthenticated: true,
              loading: false,
              error: null
            });
          } else {
            setState(prev => ({ ...prev, loading: false }));
          }
        } catch (error) {
          console.error("Failed to load authentication state:", error);
          setState(prev => ({ ...prev, loading: false }));
        }
      };
  
      loadSession();
    }, []);
  
    // Helper function to update state and save session
    const saveSession = (session: string, user: User) => {
      localStorage.setItem("auth_session", session);
      localStorage.setItem("auth_user", JSON.stringify(user));
      
      setState({
        user,
        session,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    };
  
    // Auth methods that will interact with the API
    const login = async (emailOrCode: string, pincode?: number) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const isEmail = emailOrCode.includes("@");
        
        if (isEmail && pincode) {
          const response = await fetch("/api/v1/auth/login/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailOrCode, pincode })
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            
            if (errorData.error?.code === "WRONG_PIN_CODE") {
              throw new Error("Incorrect PIN. For testing, use 123456.");
            } else {
              throw new Error(errorData.error?.message || "Login failed");
            }
          }
    
          const { data } = await response.json();
          saveSession(data.session, { email: emailOrCode });
          
        } else if (!isEmail && emailOrCode.length === 16) {
          const response = await fetch("/api/v1/auth/login/code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login_code: emailOrCode })
          });
    
          if (!response.ok) {
            const errorData = await response.json();
          
            if (errorData.error?.code === "AUTHENTICATION_ERROR") {
              throw new Error("Invalid access code. Please check and try again.");
            } else {
              throw new Error(errorData.error?.message || "Login failed");
            }
          }
    
          const { data } = await response.json();
          saveSession(data.session, { loginCode: emailOrCode });
          
        } else {
          throw new Error("Invalid input format");
        }
        
        setState(prev => ({ ...prev, loading: false }));
        
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : "Login failed" 
        }));
        throw error; 
      }
    };
  
    const registerWithEmail = async (email: string, lang = "en") => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await fetch("/api/v1/user/register/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, lang })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }
        
        setState(prev => ({ ...prev, loading: false }));
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : "Registration failed" 
        }));
      }
    };
  
    const registerAnonymously = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await fetch("/api/v1/user/register/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }).then(res => res.json());
        
        setState(prev => ({ ...prev, loading: false }));
        return response.data.login_code;
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : "Registration failed" 
        }));
        return "";
      }
    };
  
    const loginWithGoogle = async (code: string, redirectUri: string) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const { data } = await fetch("/api/v1/user/register/google_account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, redirect_uri: redirectUri })
        }).then(res => res.json());
        
        saveSession(data.session, {});
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : "Google login failed" 
        }));
      }
    };
  
    const logout = () => {
      localStorage.removeItem("auth_session");
      localStorage.removeItem("auth_user");
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    };
  
    const clearError = () => setState(prev => ({ ...prev, error: null }));

    const value: AuthContextType = {
      ...state,
      login,
      registerWithEmail,
      registerAnonymously,
      loginWithGoogle,
      logout,
      clearError
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
