'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface SelectOptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  'aria-label'?: string;
  id?: string;
  name?: string;
  wrapperClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

function extractOptions(children: React.ReactNode): SelectOptionItem[] {
  const result: SelectOptionItem[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      const fragProps = child.props as { children?: React.ReactNode };
      result.push(...extractOptions(fragProps.children));
      return;
    }

    if (child.type === 'option') {
      const optProps = child.props as {
        value?: string | number;
        disabled?: boolean;
        children?: React.ReactNode;
      };
      const rawLabel = React.Children.toArray(optProps.children)
        .map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : ''))
        .join('')
        .trim();
      const rawValue = optProps.value !== undefined ? String(optProps.value) : rawLabel;
      result.push({
        value: rawValue,
        label: rawLabel || rawValue,
        disabled: optProps.disabled,
      });
    }
  });

  return result;
}

/**
 * Custom accessible select dropdown that prevents horizontal overflow on mobile
 * and wraps long option labels cleanly inside the viewport.
 */
export default function SelectField({
  value,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  id,
  name,
  wrapperClassName = '',
  className = '',
  children,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const options = useMemo(() => extractOptions(children), [children]);
  const currentValue = value !== undefined ? String(value) : options[0]?.value ?? '';
  const selectedOption = options.find((opt) => opt.value === currentValue) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleSelect = (optValue: string) => {
    setOpen(false);
    if (!onChange) return;
    const syntheticEvent = {
      target: { value: optValue, name: name || '' },
      currentTarget: { value: optValue, name: name || '' },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 max-w-full ${wrapperClassName}`}
    >
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full min-w-0 max-w-full min-h-[44px] flex items-center justify-between gap-2 overflow-hidden bg-[#f8fafc] border rounded-[4px] px-3 py-2 text-[16px] sm:text-[13px] text-[#0b132b] transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          open ? 'border-[#0b132b] ring-1 ring-[#0b132b]' : 'border-[#dce2ea] hover:border-[#94a3b8]'
        } ${className}`}
      >
        <span className="truncate text-left flex-1 min-w-0">
          {selectedOption ? selectedOption.label : ''}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#64748b] shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 top-full mt-1 z-50 w-full max-h-60 overflow-y-auto bg-white border border-[#dce2ea] rounded-[6px] shadow-lg py-1"
        >
          {options.map((opt) => {
            const isSelected = opt.value === currentValue;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-3 py-2.5 text-[14px] sm:text-[13px] whitespace-normal break-words flex items-center justify-between gap-2 transition-colors cursor-pointer disabled:opacity-40 ${
                    isSelected
                      ? 'bg-[#0b132b] text-white font-semibold'
                      : 'text-[#0b132b] hover:bg-[#f8fafc]'
                  }`}
                >
                  <span className="flex-1 min-w-0">{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#f59e0b] shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
