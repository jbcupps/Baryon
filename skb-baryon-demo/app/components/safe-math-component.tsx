
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Define KaTeX types to match actual library
interface KaTeXOptions {
  throwOnError?: boolean;
  displayMode?: boolean;
  output?: "html" | "mathml" | "htmlAndMathml";
  trust?: boolean;
  strict?: boolean | string;
  macros?: Record<string, string>;
  colorIsTextColor?: boolean;
  maxSize?: number;
  maxExpand?: number;
  globalGroup?: boolean;
  fleqn?: boolean;
  leqno?: boolean;
}

interface KaTeXLib {
  render: (tex: string, element: HTMLElement, options?: any) => void;
  renderToString: (tex: string, options?: any) => string;
}

// Error boundary for math rendering
class MathErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Math rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Safe math component with dynamic loading
interface SafeMathComponentProps {
  formula: string;
  display?: boolean;
  className?: string;
}

const SafeMathComponent: React.FC<SafeMathComponentProps> = ({ 
  formula, 
  display = false, 
  className = "" 
}) => {
  const [katex, setKatex] = useState<KaTeXLib | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadKaTeX = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Dynamically import KaTeX CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
        cssLink.integrity = 'sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn';
        cssLink.crossOrigin = 'anonymous';
        
        // Only add if not already present
        if (!document.querySelector('link[href*="katex"]')) {
          document.head.appendChild(cssLink);
        }

        // Wait a bit for CSS to load
        await new Promise(resolve => setTimeout(resolve, 100));

        // Dynamically import KaTeX library
        const katexModule = await import('katex');
        setKatex(katexModule.default || katexModule);
      } catch (error) {
        console.warn('Failed to load KaTeX:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadKaTeX();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <span className={`bg-slate-100 px-2 py-1 rounded animate-pulse ${className}`}>
        Loading math...
      </span>
    );
  }

  // Error state - show plain text formula
  if (hasError || !katex) {
    return (
      <span className={`bg-slate-100 px-2 py-1 rounded font-mono text-sm ${className}`}>
        {formula}
      </span>
    );
  }

  // Render with KaTeX
  try {
    const html = katex.renderToString(formula, {
      throwOnError: false,
      displayMode: display,
      output: 'html' as any,
      trust: false,
      strict: false
    });

    return (
      <MathErrorBoundary
        fallback={
          <span className={`bg-slate-100 px-2 py-1 rounded font-mono text-sm ${className}`}>
            {formula}
          </span>
        }
      >
        <span 
          className={`${display ? "math-formula block" : "inline-block"} ${className}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </MathErrorBoundary>
    );
  } catch (error) {
    console.warn('KaTeX rendering error:', error);
    return (
      <span className={`bg-slate-100 px-2 py-1 rounded font-mono text-sm ${className}`}>
        {formula}
      </span>
    );
  }
};

export default SafeMathComponent;
