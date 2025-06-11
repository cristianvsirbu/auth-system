import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Card({ title, children, footer }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-2">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-medium text-secondary-800">
            {title}
          </h3>
        </div>
      )}
      <div className="px-6 py-5 flex flex-col gap-4">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
}