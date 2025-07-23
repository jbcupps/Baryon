
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Portal } from '@radix-ui/react-portal';

interface TooltipProps {
  content: React.ReactNode | string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  className?: string;
  disabled?: boolean;
  maxWidth?: number;
  interactive?: boolean;
}

export const AdvancedTooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 500,
  className = '',
  disabled = false,
  maxWidth = 320,
  interactive = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let x = 0;
    let y = 0;
    const offset = 8;

    // Calculate base position
    switch (side) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Adjust for alignment
    if (side === 'top' || side === 'bottom') {
      if (align === 'start') {
        x = triggerRect.left;
      } else if (align === 'end') {
        x = triggerRect.right - tooltipRect.width;
      }
    } else {
      if (align === 'start') {
        y = triggerRect.top;
      } else if (align === 'end') {
        y = triggerRect.bottom - tooltipRect.height;
      }
    }

    // Viewport bounds checking with fallback positioning
    if (x < 10) {
      x = 10;
    } else if (x + tooltipRect.width > viewport.width - 10) {
      x = viewport.width - tooltipRect.width - 10;
    }

    if (y < 10) {
      // If tooltip would go above viewport, show it below trigger
      y = triggerRect.bottom + offset;
    } else if (y + tooltipRect.height > viewport.height - 10) {
      // If tooltip would go below viewport, show it above trigger
      y = triggerRect.top - tooltipRect.height - offset;
    }

    setPosition({ x, y });
  };

  const showTooltip = () => {
    if (disabled || !content) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip becomes visible
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (interactive) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 150);
    } else {
      setIsVisible(false);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (interactive && hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    if (interactive) {
      hideTooltip();
    }
  };

  // Handle window resize and scroll
  useEffect(() => {
    if (isVisible) {
      const handleReposition = () => calculatePosition();
      window.addEventListener('resize', handleReposition);
      window.addEventListener('scroll', handleReposition, true);

      return () => {
        window.removeEventListener('resize', handleReposition);
        window.removeEventListener('scroll', handleReposition, true);
      };
    }
  }, [isVisible]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isVisible) {
      hideTooltip();
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {children}
      </div>

      {isVisible && (
        <Portal>
          <div
            ref={tooltipRef}
            className={cn(
              'fixed z-[9999] px-3 py-2 text-sm font-medium text-white bg-slate-900 rounded-md shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              'border border-slate-700',
              className
            )}
            style={{
              left: position.x,
              top: position.y,
              maxWidth: `${maxWidth}px`,
              wordWrap: 'break-word'
            }}
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
            role="tooltip"
          >
            <div className="text-left leading-relaxed">
              {content}
            </div>

            {/* Tooltip arrow - positioned based on side */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-slate-900 border border-slate-700 rotate-45',
                {
                  'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-0 border-l-0': side === 'top',
                  'top-[-4px] left-1/2 -translate-x-1/2 border-b-0 border-r-0': side === 'bottom',
                  'right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0': side === 'left',
                  'left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0': side === 'right'
                }
              )}
            />
          </div>
        </Portal>
      )}
    </>
  );
};

// Specialized tooltip for mathematical formulas
export const MathTooltip: React.FC<Omit<TooltipProps, 'content'> & { 
  formula: string; 
  explanation: string;
  variables?: Array<{symbol: string, meaning: string}>;
}> = ({
  formula,
  explanation,
  variables = [],
  ...props
}) => {
  const content = (
    <div className="space-y-3">
      <div className="font-mono text-blue-200 text-base border-b border-slate-600 pb-2">
        {formula}
      </div>
      <div className="text-slate-100">
        {explanation}
      </div>
      {variables.length > 0 && (
        <div className="space-y-1 border-t border-slate-600 pt-2">
          <div className="text-slate-300 font-medium text-xs">Where:</div>
          {variables.map((variable, i) => (
            <div key={i} className="text-xs text-slate-200 flex items-start gap-2">
              <span className="font-mono text-blue-200 min-w-fit">{variable.symbol}</span>
              <span>=</span>
              <span>{variable.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return <AdvancedTooltip content={content} maxWidth={400} {...props} />;
};

// Specialized tooltip for parameter controls
export const ControlTooltip: React.FC<Omit<TooltipProps, 'content'> & {
  title: string;
  description: string;
  range?: string;
  effect: string;
  shortcut?: string;
}> = ({
  title,
  description,
  range,
  effect,
  shortcut,
  ...props
}) => {
  const content = (
    <div className="space-y-2">
      <div className="font-semibold text-blue-200 border-b border-slate-600 pb-1">
        {title}
      </div>
      <div className="text-slate-100 text-sm">
        {description}
      </div>
      {range && (
        <div className="text-xs text-slate-300">
          <span className="font-medium">Range:</span> {range}
        </div>
      )}
      <div className="text-xs text-green-200 bg-green-900/20 px-2 py-1 rounded">
        <span className="font-medium">Effect:</span> {effect}
      </div>
      {shortcut && (
        <div className="text-xs text-amber-200 bg-amber-900/20 px-2 py-1 rounded">
          <span className="font-medium">Shortcut:</span> <kbd className="bg-slate-800 px-1 rounded">{shortcut}</kbd>
        </div>
      )}
    </div>
  );

  return <AdvancedTooltip content={content} maxWidth={350} {...props} />;
};

// Specialized tooltip for status indicators
export const StatusTooltip: React.FC<Omit<TooltipProps, 'content'> & {
  metric: string;
  value: string | number;
  interpretation: string;
  goodRange?: string;
}> = ({
  metric,
  value,
  interpretation,
  goodRange,
  ...props
}) => {
  const content = (
    <div className="space-y-2">
      <div className="font-semibold text-blue-200 border-b border-slate-600 pb-1">
        {metric}
      </div>
      <div className="text-lg font-mono text-green-200">
        Current: {value}
      </div>
      <div className="text-slate-100 text-sm">
        {interpretation}
      </div>
      {goodRange && (
        <div className="text-xs text-amber-200 bg-amber-900/20 px-2 py-1 rounded">
          <span className="font-medium">Optimal Range:</span> {goodRange}
        </div>
      )}
    </div>
  );

  return <AdvancedTooltip content={content} maxWidth={300} {...props} />;
};

export default AdvancedTooltip;
