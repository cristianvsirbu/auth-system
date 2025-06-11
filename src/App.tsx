import type { ReactNode } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AnonymousCodePage from './pages/AnonymousCodePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import EmailVerifyPage from './pages/EmailVerifyPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Router>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reg" element={<RegisterPage />} />
                <Route path="/auth/email" element={<EmailVerifyPage />} />
                <Route path="/reg/code" element={<AnonymousCodePage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
            </Router>
          </div>
        </div>
      </main>
    </AuthProvider>
  );
}
