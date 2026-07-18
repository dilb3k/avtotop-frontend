'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 12);
  let formatted = '+998';
  if (digits.length > 3) formatted += ' ' + digits.slice(3, 5);
  if (digits.length > 5) formatted += ' ' + digits.slice(5, 8);
  if (digits.length > 8) formatted += ' ' + digits.slice(8, 10);
  if (digits.length > 10) formatted += ' ' + digits.slice(10, 12);
  return formatted;
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label, error, value, onChange, className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      const withPrefix = raw.startsWith('998') ? raw : '998' + raw.replace(/^998/, '');
      onChange(formatPhone(withPrefix));
    };

    const displayValue = value ? formatPhone(value.replace(/\D/g, '').replace(/^998/, '998' + value.replace(/\D/g, '').replace(/^998/, ''))) : '+998 ';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder="+998 XX XXX XX XX"
          className={`
            w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200 placeholder:text-gray-400
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
