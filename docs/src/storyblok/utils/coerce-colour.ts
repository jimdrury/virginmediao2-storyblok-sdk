export type Colors =
  | 'default'
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'error';

export const coerceTextColor = (color: Colors) => {
  switch (color) {
    case 'default':
      return 'text-default';
    case 'neutral':
      return 'text-neutral';
    case 'primary':
      return 'text-primary';
    case 'secondary':
      return 'text-secondary';
    case 'accent':
      return 'text-accent';
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-info';
    case 'error':
      return 'text-error';
  }
};

export const coerceBgColor = (color: Colors) => {
  switch (color) {
    case 'default':
      return 'bg-default';
    case 'neutral':
      return 'bg-neutral';
    case 'primary':
      return 'bg-primary';
    case 'secondary':
      return 'bg-secondary';
    case 'accent':
      return 'bg-accent';
    case 'success':
      return 'bg-success';
    case 'warning':
      return 'bg-warning';
    case 'info':
      return 'bg-info';
    case 'error':
      return 'bg-error';
  }
};
