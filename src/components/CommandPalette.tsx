import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowUp, FiCornerDownLeft, FiGlobe, FiHash, FiMessageCircle, FiSearch, FiVolume2 } from 'react-icons/fi';
import { LINKS } from './SocialLinks';
import { isMuted, play, setMuted } from '../utils/sound';
import { scrollToSection } from '../utils/scrollToSection';

interface Command {
  id: string;
  group: string;
  label: string;
  icon: React.ReactNode;
  run: () => void;
}

const SECTIONS = [
  ['experience', 'nav.experience'],
  ['tech-stack', 'nav.techStack'],
  ['projects', 'nav.projects'],
  ['writeups', 'nav.writeups'],
  ['contact', 'nav.contact'],
] as const;

const LANGUAGES = { FR: 'Français', EN: 'English', PT: 'Português', ES: 'Español', DE: 'Deutsch' };

// Ignore les accents et majuscules dans la recherche
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Menu de commandes : Ctrl+K (ou ⌘K) ouvre, flèches choisissent, Entrée exécute
const CommandPalette: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActive(0);
    setOpen(true);
    play('tap');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) close();
        else show();
      }
    };
    const onOpen = () => show();
    window.addEventListener('keydown', onKey);
    window.addEventListener('palette:open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('palette:open', onOpen);
    };
  }, [open, close, show]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const commands = useMemo<Command[]>(() => [
    { id: 'top', group: t('palette.go'), label: t('palette.top'), icon: <FiArrowUp />, run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    ...SECTIONS.map(([id, key]) => ({ id, group: t('palette.go'), label: t(key), icon: <FiHash />, run: () => scrollToSection(id) })),
    { id: 'chat', group: t('palette.actions'), label: t('chat.open'), icon: <FiMessageCircle />, run: () => window.dispatchEvent(new Event('chat:open')) },
    {
      id: 'sound',
      group: t('palette.actions'),
      label: isMuted() ? t('sound.on') : t('sound.off'),
      icon: <FiVolume2 />,
      run: () => setMuted(!isMuted()),
    },
    ...Object.entries(LANGUAGES).map(([code, name]) => ({
      id: `lang-${code}`,
      group: t('palette.language'),
      label: name,
      icon: <FiGlobe />,
      run: () => i18n.changeLanguage(code),
    })),
    ...LINKS.map(({ label, href, Icon }) => ({
      id: `link-${label}`,
      group: t('palette.links'),
      label,
      icon: <Icon />,
      run: () => {
        if (href.endsWith('.pdf')) {
          const a = document.createElement('a');
          a.href = href;
          a.download = 'CV_Pavel_Gatti.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      },
    })),
  ], [t, i18n]);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return commands;
    return commands.filter((c) => fold(c.label).includes(q) || fold(c.group).includes(q));
  }, [commands, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[active];
      if (target) {
        close();
        target.run();
      }
    }
  };

  useEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  return createPortal(
    <div
      className="palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="palette__box" role="dialog" aria-modal="true" aria-label={t('palette.title')}>
        <div className="palette__search">
          <FiSearch size={18} aria-hidden />
          <input
            ref={input}
            type="text"
            placeholder={t('palette.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">ESC</kbd>
        </div>

        <ul ref={list} className="palette__list" role="listbox">
          {filtered.length === 0 ? (
            <li className="palette__empty">{t('palette.empty')}</li>
          ) : (
            filtered.map((cmd, i) => (
              <li
                key={cmd.id}
                data-index={i}
                role="option"
                aria-selected={i === active}
                className="palette__item"
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  close();
                  cmd.run();
                }}
              >
                <span className="palette__icon">{cmd.icon}</span>
                <span className="palette__label">{cmd.label}</span>
                <span className="text-xs text-slate-500 mr-2">{cmd.group}</span>
                {i === active && <FiCornerDownLeft className="palette__enter" aria-hidden />}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default CommandPalette;
