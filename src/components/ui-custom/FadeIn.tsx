
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 700,
  once = true,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!hasAnimated || !once)) {
          setIsVisible(true);
          if (once) setHasAnimated(true);
        } else if (!entry.isIntersecting && !once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, hasAnimated, threshold]);

  // Base styles for all directions
  const baseStyles = {
    opacity: isVisible ? 1 : 0,
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Direction-specific styles
  const directionStyles = {
    up: {
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    },
    down: {
      transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
    },
    left: {
      transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
    },
    right: {
      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
    },
    none: {
      transform: 'none',
    },
  };

  const styles = {
    ...baseStyles,
    ...directionStyles[direction],
  };

  return (
    <div ref={ref} className={cn(className)} style={styles}>
      {children}
    </div>
  );
};

export default FadeIn;
