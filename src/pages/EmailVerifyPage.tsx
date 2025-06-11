import { type FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';

export default function EmailVerifyPage() {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error('No email found. Redirecting to login page.');
      navigate('/auth');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: number | undefined;

    if (countdown > 0) {
      timer = window.setTimeout(
        () => setCountdown((prevCount) => prevCount - 1),
        1000,
      );
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pincode) {
      setError('Please enter the 6-digit verification PIN');
      toast.error('Please enter the verification PIN');
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError('PIN must be 6 digits');
      toast.error('PIN must be exactly 6 digits');
      return;
    }

    try {
      await login(email, Number(pincode));
      toast.success('Verification successful! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('PIN verification failed. Please try again.');
        toast.error(
          'Verification failed. Please check your PIN and try again.',
        );
      }
    }
  };

  const handleResendPin = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    toast.loading('Sending new verification code...', { id: 'resend-pin' });

    try {
      await fetch('/api/v1/user/register/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: 'en' }),
      });

      setCountdown(60);
      toast.dismiss('resend-pin');
      toast.success('New verification code sent to your email');
    } catch (err) {
      toast.dismiss('resend-pin');
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Failed to resend verification code. Please try again.');
        toast.error('Failed to send new code. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card title="Email Verification">
      <div className="space-y-6">
        {!email && (
          <p className="text-sm text-red-600">
            No email found. Please return to login.
          </p>
        )}

        {email && (
          <>
            <p className="text-sm text-gray-600">
              Enter the 6-digit PIN sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Verification PIN"
                id="pin-input"
                type="text"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
                }
                error={error}
                placeholder="123456"
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                autoFocus
              />

              <Button type="submit" fullWidth isLoading={loading}>
                Verify
              </Button>
            </form>
          </>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>

          {countdown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend in {countdown} seconds
            </p>
          ) : (
            <button
              onClick={handleResendPin}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        <div className="text-center border-t border-gray-200 pt-4">
          <Link
            to="/auth"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </Card>
  );
}
