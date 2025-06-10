import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AnonymousCodePage from "./pages/AnonymousCodePage";
import AuthPage from "./pages/AuthPage";
import EmailVerifyPage from "./pages/EmailVerifyPage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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
			<main>
				<Router>
					<Routes>
						<Route path="/auth" element={<AuthPage />} />
						<Route path="/reg" element={<RegisterPage />} />
						<Route path="/auth/email" element={<EmailVerifyPage />} />
						<Route path="/reg/code" element={<AnonymousCodePage />} />
						<Route path="*" element={<Navigate to="/auth" replace />} />
					</Routes>
				</Router>
			</main>
		</AuthProvider>
	);
}
