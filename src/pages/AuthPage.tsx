import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const { login, loading, error: authError } = useAuth();

  const navigate = useNavigate();

  // Detect if input is email or 16-digit code
  const isEmail = input.includes('@');
  const isCode = /^\d{16}$/.test(input);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!input) {
      setError('Please enter an email or 16-digit code');
      toast.error('Please enter an email or access code');
      return;
    }

    if (isEmail) {
      try {
        toast.loading('Sending verification code...', { id: 'email-auth' });
        await fetch('/api/v1/user/register/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: input, lang: 'en' }),
        });
        toast.dismiss('email-auth');
        toast.success('Verification code sent!');
        navigate('/auth/email', { state: { email: input } });
      } catch (error) {
        toast.dismiss('email-auth');
        if (error instanceof Error) {
          setError(error.message);
          toast.error(error.message);
        } else {
          setError('Failed to register with email');
          toast.error('Failed to send verification code');
        }
      }
    } else if (isCode) {
      try {
        toast.loading('Verifying access code...', { id: 'code-auth' });
        await login(input);
        toast.dismiss('code-auth');
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (error) {
        toast.dismiss('code-auth');
        setError('Invalid access code');
        toast.error('Invalid access code. Please try again.');
      }
    } else {
      setError('Please enter a valid email or 16-digit code');
      toast.error(
        'Invalid format. Please enter a valid email or 16-digit code',
      );
    }
  };

  return (
    <Card title="Authentication">
      <form onSubmit={handleSubmit} className="space-y-6 flex flex-col gap-4">
        <Input
          label="Email or Access Code"
          id="auth-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          error={error}
          placeholder={isEmail ? 'email@example.com' : '16-digit access code'}
          autoComplete="off"
          autoFocus
        />

        <Button type="submit" fullWidth isLoading={loading}>
          {isEmail ? 'Continue with Email' : 'Login with Access Code'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/reg" className="text-blue-600 hover:text-blue-800">
              Register
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}
