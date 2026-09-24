'use client';
import { useEffect, useId, useRef, useState } from 'react';

type Option = { value: string; label: string };
type Props = { label: string; options: Option[]; name?: string; placeholder?: string; value?: string; onChange?: (value: string) => void };

export default function ThemeSelect({ label, options, name, placeholder = 'Select an option', value, onChange }: Props) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef({ text: '', time: 0 });
  const [localValue, setLocalValue] = useState('');
  const selected = value ?? localValue;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const chosen = options.find(option => option.value === selected);

  useEffect(() => {
    const form = root.current?.closest('form');
    const reset = () => { setLocalValue(''); setOpen(false); };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, []);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, id]);
  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    setLocalValue(option.value); onChange?.(option.value); setOpen(false); trigger.current?.focus();
  }
  function show() {
    setActive(Math.max(0, options.findIndex(option => option.value === selected)));
    setOpen(true);
  }
  return <div ref={root} className="theme-select field" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <span id={`${id}-label`}>{label}</span>
    {name && <input type="hidden" name={name} value={selected} />}
    <button ref={trigger} type="button" className="theme-select-trigger" role="combobox"
      aria-labelledby={`${id}-label`} aria-expanded={open} aria-haspopup="listbox"
      aria-controls={`${id}-list`} aria-activedescendant={open ? `${id}-option-${active}` : undefined}
      onClick={() => open ? setOpen(false) : show()}
      onKeyDown={event => {
        if (event.key === 'Tab') { setOpen(false); return; }
        if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
        if (['Enter', ' '].includes(event.key)) { event.preventDefault(); open ? choose(active) : show(); return; }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          if (!open) { show(); return; }
          setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : Math.max(0, Math.min(options.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))));
          return;
        }
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          const now = Date.now();
          search.current = { text: (now - search.current.time < 600 ? search.current.text : '') + event.key.toLowerCase(), time: now };
          const match = options.findIndex(option => option.label.toLowerCase().replace(/^↳\s*/, '').startsWith(search.current.text));
          if (match >= 0) { setOpen(true); setActive(match); }
        }
      }}>
      <span className={chosen ? '' : 'theme-select-placeholder'}>{chosen?.label ?? placeholder}</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="theme-select-options">
      {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option"
        aria-selected={selected === option.value} className={active === index ? 'is-active' : ''}
        onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)}>
        <span>{option.label}</span><span aria-hidden="true">{selected === option.value ? '✓' : ''}</span>
      </li>)}
    </ul>}
  </div>;
}
