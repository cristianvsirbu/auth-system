import { type InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles =
      'px-3 py-2 border rounded-md shadow-sm focus:outline-none';
    const stateStyles = error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label
            htmlFor={rest.id}
            className={`block text-sm font-medium ${
              error ? 'text-red-700' : 'text-gray-700'
            } ${isFocused ? 'text-blue-600' : ''}`}
          >
            {label}
          </label>
        )}
        <div className="mt-1">
          <input
            ref={ref}
            className={`${baseStyles} ${stateStyles} ${widthStyles}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
