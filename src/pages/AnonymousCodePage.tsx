import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

export default function AnonymousCodePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const code = location.state?.code;

  // If no code is present, redirect to registration page
  useEffect(() => {
    if (!code) {
      toast.error('No access code found. Redirecting to registration.');
      navigate('/reg');
    }
  }, [code, navigate]);

  const formattedCode = code ? code.match(/.{1,4}/g)?.join(' ') : '';

  const handleCopyCode = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Failed to copy code. Please try again or copy manually.');
      setCopied(false);
    }
  };

  const handleLogin = () => {
    toast.success('Redirecting to login...');
    navigate('/auth');
  };

  if (!code) {
    return null;
  }

  return (
    <Card title="Your Anonymous Access Code">
      <div className="space-y-6">
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600">
            Save this code to login later. This is the only time you'll see it!
          </p>

          <div className="bg-gray-100 p-4 rounded-lg my-4">
            <p className="text-xl font-mono font-bold tracking-wider">
              {formattedCode}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleCopyCode}
              fullWidth
              variant={copied ? 'secondary' : 'primary'}
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </Button>

            <Button onClick={handleLogin} fullWidth variant="secondary">
              Continue to Login
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
