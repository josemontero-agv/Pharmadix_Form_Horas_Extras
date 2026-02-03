import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function PageContainer({ children, className, padded = true }: PageContainerProps) {
  return (
    <main
      className={cn(
        'flex-1 overflow-y-auto',
        padded && 'p-4 sm:p-6',
        className
      )}
    >
      {children}
    </main>
  );
}
