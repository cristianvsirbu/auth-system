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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-primary-600 font-medium">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col w-full">
          <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md mx-auto">
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
            </div>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}
