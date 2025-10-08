import clsx from 'clsx';
import type { ComponentProps, FC, ReactNode } from 'react';
import type { IconType } from 'react-icons';

import {
  FaCircleCheck,
  FaCircleExclamation,
  FaCircleInfo,
  FaTriangleExclamation,
} from 'react-icons/fa6';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertDecoration = 'none' | 'outline' | 'dash' | 'soft';

export interface AlertProps extends ComponentProps<'div'> {
  title: string;
  children: ReactNode;
  variant?: AlertVariant;
  decoration?: AlertDecoration;
}

const AlertIconMap: Record<AlertVariant, IconType> = {
  info: FaCircleInfo,
  success: FaCircleCheck,
  warning: FaTriangleExclamation,
  error: FaCircleExclamation,
};

export const Alert: FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  decoration = 'none',
  className,
  ...props
}) => {
  const Icon = AlertIconMap[variant];
  return (
    <div
      className={clsx(
        {
          alert: true,
          'p-3': true,
          'gap-3': true,
          'alert-info': variant === 'info',
          'alert-horizontal': true,
          'alert-success': variant === 'success',
          'alert-warning': variant === 'warning',
          'alert-error': variant === 'error',
          'alert-soft': decoration === 'soft',
          'alert-outline': decoration === 'outline',
          'alert-dash': decoration === 'dash',
        },
        className,
      )}
      {...props}
    >
      <Icon size={24} className="self-start" />
      <div className="text-base-content">
        <span className="font-bold text-base">{title}</span>
        <div className="text-md">{children}</div>
      </div>
    </div>
  );
};
