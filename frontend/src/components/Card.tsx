import React, { forwardRef } from 'react';

type CardVariant = 'elevated' | 'outlined' | 'filled' | 'unstyled';
type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  isHoverable?: boolean;
  isInteractive?: boolean;
  fullWidth?: boolean;
  centerContent?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'elevated',
  size = 'md',
  className = '',
  header,
  footer,
  isHoverable = false,
  isInteractive = false,
  fullWidth = false,
  centerContent = false,
  ...props
}, ref) => {

  const variantClasses = {
    elevated: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
    unstyled: '',
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const cardClasses = [
    'rounded-lg transition-all duration-200',
    variantClasses[variant],
    sizeClasses[size],
    isHoverable ? 'hover:shadow-lg' : '',
    isInteractive ? 'cursor-pointer active:scale-[0.98]' : '',
    fullWidth ? 'w-full' : '',
    centerContent ? 'flex flex-col items-center justify-center' : '',
    className
  ].join(' ');

  const headerClasses = `${variant === 'outlined' ? 'border-b border-gray-200' : ''} -mt-${size === 'sm' ? '3' : size === 'md' ? '5' : '7'} -mx-${size === 'sm' ? '3' : size === 'md' ? '5' : '7'} mb-4 px-${size === 'sm' ? '3' : size === 'md' ? '5' : '7'} py-3`;
  const footerClasses = `${variant === 'outlined' ? 'border-t border-gray-200' : ''} -mb-${size === 'sm' ? '3' : size === 'md' ? '5' : '7'} -mx-${size === 'sm' ? '3' : size === 'md' ? '5' : '7'} mt-4 px-${size === 'sm' ? '3' : size === 'md' ? '5' : '7'} py-3`;

  return (
    <div
      ref={ref}
      className={cardClasses}
      {...props}
    >
      {header && (
        <div className={headerClasses}>
          {header}
        </div>
      )}
      
      <div className={`${centerContent ? 'flex flex-col items-center justify-center' : ''}`}>
        {children}
      </div>
      
      {footer && (
        <div className={footerClasses}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
