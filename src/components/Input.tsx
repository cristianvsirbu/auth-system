import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export default function Input({
  label,
  id,
  error,
  className = '',
  ...rest
}: InputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`block w-full px-4 py-3 rounded-lg border ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
        } shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
        {...rest}
      />
    </div>
  );
}
