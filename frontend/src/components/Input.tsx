import React, { forwardRef, useState } from 'react';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'outline' | 'filled' | 'flushed';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'outline',
  fullWidth = true,
  isRequired = false,
  isInvalid = false,
  isDisabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-4',
  };

  const variantClasses = {
    outline: `bg-white border ${isInvalid ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-300'} rounded`,
    filled: `${isInvalid ? 'bg-red-50' : isFocused ? 'bg-blue-50' : 'bg-gray-100'} border-transparent rounded`,
    flushed: `bg-transparent border-0 border-b-2 rounded-none ${isInvalid ? 'border-b-red-500' : isFocused ? 'border-b-blue-500' : 'border-b-gray-300'}`,
  };

  const inputClasses = [
    'w-full transition-colors duration-200',
    'focus:outline-none',
    sizeClasses[size],
    variantClasses[variant],
    isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : '',
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : '',
    className
  ].join(' ');

  const containerClasses = [
    'relative',
    fullWidth ? 'w-full' : '',
    'mb-4',
    containerClassName
  ].join(' ');

  const labelClasses = [
    'block text-gray-700 font-medium mb-1',
    isDisabled ? 'opacity-60' : '',
    size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
    labelClassName
  ].join(' ');

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={isDisabled}
          aria-invalid={isInvalid}
          aria-describedby={helperText || errorText ? `${inputId}-description` : undefined}
          required={isRequired}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <div 
          id={`${inputId}-description`}
          className={`mt-1 text-sm ${isInvalid ? 'text-red-600' : 'text-gray-500'}`}
        >
          {isInvalid ? errorText : helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
