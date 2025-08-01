"use client";

import ReactMarkdown from 'react-markdown';
import { cn } from '@/utils/utils';

interface MarkdownProps {
  content: string;
  className?: string;
  variant?: 'default' | 'compact' | 'chat';
}

export function Markdown({ content, className, variant = 'default' }: MarkdownProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          h1: ({children}) => <h1 className="text-lg font-bold text-custom-primary mb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-md font-semibold text-custom-primary mb-2">{children}</h2>,
          h3: ({children}) => <h3 className="text-sm font-medium text-custom-secondary mb-1">{children}</h3>,
          p: ({children}) => <p className="mb-2 text-sm">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
          li: ({children}) => <li className="text-sm">{children}</li>,
          strong: ({children}) => <strong className="font-semibold text-custom-primary">{children}</strong>,
          em: ({children}) => <em className="italic text-custom-secondary">{children}</em>,
          code: ({children}) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
              {children}
            </code>
          ),
        };
      case 'chat':
        return {
          h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-md font-semibold mb-2">{children}</h2>,
          h3: ({children}) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
          p: ({children}) => <p className="mb-2">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({children}) => <li>{children}</li>,
          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
          em: ({children}) => <em className="italic">{children}</em>,
          code: ({children}) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
              {children}
            </code>
          ),
        };
      default:
        return {
          h1: ({children}) => <h1 className="text-xl font-bold text-custom-primary mb-4">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-semibold text-custom-primary mb-3 mt-6">{children}</h2>,
          h3: ({children}) => <h3 className="text-md font-medium text-custom-secondary mb-2 mt-4">{children}</h3>,
          p: ({children}) => <p className="mb-3 text-gray-700 dark:text-gray-300">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          li: ({children}) => <li className="text-gray-700 dark:text-gray-300">{children}</li>,
          strong: ({children}) => <strong className="font-semibold text-custom-primary">{children}</strong>,
          em: ({children}) => <em className="italic text-custom-secondary">{children}</em>,
          blockquote: ({children}) => (
            <blockquote className="border-l-4 border-custom-primary pl-4 my-4 bg-custom-light dark:bg-gray-800 p-3 rounded-r">
              {children}
            </blockquote>
          ),
          code: ({children}) => (
            <code className="bg-custom-light dark:bg-gray-800 px-2 py-1 rounded text-sm">
              {children}
            </code>
          ),
        };
    }
  };

  return (
    <ReactMarkdown 
      className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none", className)}
      components={getVariantStyles()}
    >
      {content}
    </ReactMarkdown>
  );
}
