import { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-6 shadow-sm border border-nature-100/50',
        className
      )}
      {...props}
    />
  );
}
