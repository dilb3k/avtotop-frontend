'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface MileageInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  value: number | string;
  onChange: (value: number) => void;
}

const formatMileage = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const MileageInput = forwardRef<HTMLInputElement, MileageInputProps>(
  ({ label, error, value, onChange, placeholder = "0", className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\s/g, '');
      if (/^\d*$/.test(raw)) {
        onChange(parseInt(raw, 10) || 0);
      }
    };

    const displayValue = typeof value === 'number'
      ? (value > 0 ? formatMileage(value) : '')
      : value
        ? formatMileage(parseInt(String(value).replace(/\s/g, ''), 10) || 0)
        : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200 placeholder:text-gray-400
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
              ${className}
            `}
            {...props}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            km
          </span>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

MileageInput.displayName = 'MileageInput';

export default MileageInput;
