"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

interface ShineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary';
}

interface ShineTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'primary' | 'secondary';
}

// Shine Button Component
export const ShineButton: React.FC<ShineButtonProps> = ({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [angle, setAngle] = useState(325);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const calculateAngle = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const pointerX = event.clientX;
      const pointerY = event.clientY;
      
      const deltaX = pointerX - centerX;
      const deltaY = pointerY - centerY;
      const angleRadians = Math.atan2(deltaY, deltaX);
      
      let angleDegrees = (angleRadians * 180) / Math.PI;
      angleDegrees = (angleDegrees + 90 + 360) % 360;
      
      setAngle(angleDegrees);
    };

    document.addEventListener('pointermove', calculateAngle);
    return () => document.removeEventListener('pointermove', calculateAngle);
  }, []);

  const variantStyles = {
    primary: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.18), rgba(30, 58, 138, 0.7))',
    secondary: 'linear-gradient(to bottom, rgba(107, 114, 128, 0.18), rgba(17, 24, 39, 0.7))',
    success: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.18), rgba(21, 128, 61, 0.7))',
    danger: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.18), rgba(153, 27, 27, 0.7))',
  };

  return (
    <button
      ref={buttonRef}
      className={`shine-element ${className}`}
      style={{ 
        '--pointer-angle': `${angle}deg`,
        '--bg-gradient': variantStyles[variant]
      } as React.CSSProperties}
      {...props}
    >
      <span className="shine-bg"></span>
      <span className="shine-effect"></span>
      <span className="shine-content">{children}</span>
      
      <style jsx>{`
        .shine-element {
          position: relative;
          padding: 0.75rem 1.5rem;
          border-radius: 16px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          font-weight: 600;
          color: white;
          overflow: hidden;
          transition: transform 0.1s ease-out;
          -webkit-tap-highlight-color: transparent;
        }

        .shine-element:active {
          transform: scale(0.99) translateY(1px);
        }

        .shine-bg,
        .shine-effect {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
        }

        .shine-bg {
          z-index: 0;
          background: var(--bg-gradient);
          backdrop-filter: saturate(2) contrast(1);
        }

        .shine-effect {
          z-index: 1;
          box-shadow: 0 0 1px 0.8px rgba(255, 255, 255, 0.9) inset;
          -webkit-mask: linear-gradient(
            var(--pointer-angle, 325deg),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.35) 30% 60%,
            rgba(255, 255, 255, 1)
          );
          mask: linear-gradient(
            var(--pointer-angle, 325deg),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.35) 30% 60%,
            rgba(255, 255, 255, 1)
          );
        }

        .shine-content {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </button>
  );
};

// Shine Input Component
export const ShineInput: React.FC<ShineInputProps> = ({ 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(325);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const calculateAngle = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const pointerX = event.clientX;
      const pointerY = event.clientY;
      
      const deltaX = pointerX - centerX;
      const deltaY = pointerY - centerY;
      const angleRadians = Math.atan2(deltaY, deltaX);
      
      let angleDegrees = (angleRadians * 180) / Math.PI;
      angleDegrees = (angleDegrees + 90 + 360) % 360;
      
      setAngle(angleDegrees);
    };

    document.addEventListener('pointermove', calculateAngle);
    return () => document.removeEventListener('pointermove', calculateAngle);
  }, []);

  const variantStyles = {
    primary: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.18), rgba(30, 58, 138, 0.7))',
    secondary: 'linear-gradient(to bottom, rgba(107, 114, 128, 0.18), rgba(17, 24, 39, 0.7))',
  };

  return (
    <div 
      ref={wrapperRef}
      className="shine-input-wrapper"
      style={{ 
        '--pointer-angle': `${angle}deg`,
        '--bg-gradient': variantStyles[variant]
      } as React.CSSProperties}
    >
      <span className="shine-bg"></span>
      <span className="shine-effect"></span>
      <input className={`shine-input ${className}`} {...props} />
      
      <style jsx>{`
        .shine-input-wrapper {
          position: relative;
          display: inline-block;
          border-radius: 12px;
          width: 100%;
        }

        .shine-bg,
        .shine-effect {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
        }

        .shine-bg {
          z-index: 0;
          background: var(--bg-gradient);
          backdrop-filter: saturate(2) contrast(1);
        }

        .shine-effect {
          z-index: 1;
          box-shadow: 0 0 1px 0.8px rgba(255, 255, 255, 0.9) inset;
          -webkit-mask: linear-gradient(
            var(--pointer-angle, 325deg),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.35) 30% 60%,
            rgba(255, 255, 255, 1)
          );
          mask: linear-gradient(
            var(--pointer-angle, 325deg),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.35) 30% 60%,
            rgba(255, 255, 255, 1)
          );
        }

        .shine-input {
          position: relative;
          z-index: 2;
          padding: 0.75rem 1rem;
          border-radius: inherit;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 1rem;
          width: 100%;
        }

        .shine-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

// Shine Textarea Component
export const ShineTextarea: React.FC<ShineTextareaProps> = ({ 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(325);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const calculateAngle = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const pointerX = event.clientX;
      const pointerY = event.clientY;
      
      const deltaX = pointerX - centerX;
      const deltaY = pointerY - centerY;
      const angleRadians = Math.atan2(deltaY, deltaX);
      
      let angleDegrees = (angleRadians * 180) / Math.PI;
      angleDegrees = (angleDegrees + 90 + 360) % 360;
      
      setAngle(angleDegrees);
    };

    document.addEventListener('pointermove', calculateAngle);
    return () => document.removeEventListener('pointermove', calculateAngle);
  }, []);

  const variantStyles = {
    primary: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.18), rgba(30, 58, 138, 0.7))',
    secondary: 'linear-gradient(to bottom, rgba(107, 114, 128, 0.18), rgba(17, 24, 39, 0.7))',
  };

  return (
    <div 
      ref={wrapperRef}
      className="shine-textarea-wrapper"
      style={{ 
        '--pointer-angle': `${angle}deg`,
        '--bg-gradient': variantStyles[variant]
      } as React.CSSProperties}
    >
      <span className="shine-bg"></span>
      <span className="shine-effect"></span>
      <textarea className={`shine-textarea ${className}`} {...props} />
      
      <style jsx>{`
        .shine-textarea-wrapper {
          position: relative;
          display: inline-block;
          border-radius: 12px;
          width: 100%;
        }

        .shine-bg,
        .shine-effect {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          pointer-events: none;
        }

        .shine-bg {
          z-index: 0;
          background: var(--bg-gradient);
          backdrop-filter: saturate(2) contrast(1);
        }

        .shine-effect {
          z-index: 1;
          box-shadow: 0 0 1px 0.8px rgba(255, 255, 255, 0.9) inset;
          -webkit-mask: linear-gradient(
            var(--pointer-angle, 325deg),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.35) 30% 60%,
            rgba(255, 255, 255, 1)
          );
          mask: linear-gradient(
            var(--pointer-angle, 325deg),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.35) 30% 60%,
            rgba(255, 255, 255, 1)
          );
        }

        .shine-textarea {
          position: relative;
          z-index: 2;
          padding: 0.75rem 1rem;
          border-radius: inherit;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 1rem;
          width: 100%;
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
        }

        .shine-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

// Demo Component
export default function ShineComponentsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-white mb-4">Shine Components</h1>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <ShineButton variant="primary">Primary</ShineButton>
        <ShineButton variant="secondary">Secondary</ShineButton>
        <ShineButton variant="success">Success</ShineButton>
        <ShineButton variant="danger">Danger</ShineButton>
      </div>
      
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div>
          <label className="block text-white/70 text-sm mb-2">Input Field</label>
          <ShineInput 
            variant="primary" 
            placeholder="Type something..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-white/70 text-sm mb-2">Textarea</label>
          <ShineTextarea 
            variant="primary" 
            placeholder="Enter multiple lines..." 
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 text-white/40 text-sm text-center max-w-md">
        Move your cursor around to see the shine effect follow your pointer
      </div>
    </div>
  );
}