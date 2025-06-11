import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card title="Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Welcome!</h2>
          <p className="mt-1 text-sm text-gray-600">
            You are now logged in
            {user?.email ? ` as ${user.email}` : ' anonymously'}.
          </p>
        </div>

        <Button onClick={handleLogout} variant="secondary" fullWidth>
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default DashboardPage;
