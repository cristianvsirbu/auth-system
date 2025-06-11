import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const {
    registerWithEmail,
    registerAnonymously,
    loading,
    error: authError,
  } = useAuth();

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email) {
      setError('Email is required');
      toast.error('Email is required');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      toast.error('Invalid email format');
      return;
    }

    try {
      // Call registerWithEmail from auth context
      await registerWithEmail(email);
      toast.success('Verification code sent to your email');
      navigate('/auth/email', { state: { email } });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Failed to register with email');
        toast.error('Registration failed. Please try again later.');
      }
    }
  };

  const handleAnonymousRegister = async () => {
    try {
      toast.loading('Generating your anonymous code...', {
        id: 'anonymous-reg',
      });
      const code = await registerAnonymously();

      if (code) {
        toast.dismiss('anonymous-reg');
        toast.success('Anonymous code generated successfully');
        navigate('/reg/code', { state: { code } });
      } else {
        toast.dismiss('anonymous-reg');
        toast.error('Failed to generate anonymous code');
        setError('Failed to register anonymously');
      }
    } catch (err) {
      toast.dismiss('anonymous-reg');
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error('Anonymous registration failed');
        setError('Failed to register anonymously');
      }
    }
  };

  const handleGoogleAuth = () => {
    toast.error('Google authentication is not implemented yet.');
  };

  return (
    <Card title="Create an Account">
      <div className="space-y-6">
        {/* Email registration form */}
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <Input
            label="Email Address"
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            placeholder="email@example.com"
            autoComplete="email"
            autoFocus
          />

          <Button type="submit" fullWidth isLoading={loading}>
            Register with Email
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleAnonymousRegister}
          isLoading={loading}
        >
          Anonymous Registration
        </Button>

        <Button variant="secondary" fullWidth onClick={handleGoogleAuth}>
          <span className="flex items-center justify-center">
            Continue with Google
          </span>
        </Button>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}
