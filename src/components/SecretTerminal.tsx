import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { play } from '../utils/sound';
import { WRITEUPS } from '../data/writeups';

// Easter egg: taper "sudo" n'importe où sur la page ouvre ce terminal secret
const SECRET = 'sudo';
const FLAG = 'PG{cur10s1ty_1s_th3_f1rst_sk1ll}';

const FILES: Record<string, string[]> = {
  'about.txt': [
    'Pavel Gatti',
    'Étudiant en Systèmes, Réseaux & Cybersécurité.',
    'Futur Administrateur Systèmes, Réseaux & Sécurité junior.',
    'Bachelor Informatique à Epitech (précédemment Web@cadémie by Epitech).',
  ],
  'writeups.txt': WRITEUPS.map((w, i) => `${String(i + 1).padStart(2, '0')}  [${w.status}] ${w.topics.join(' · ')}`),
  '.flag': [FLAG, 'Bien joué ! Retrouve-moi via le formulaire de contact.'],
};

const HELP = [
  'help        afficher cette liste',
  'whoami      qui commande ici',
  'ls [-a]     lister les fichiers',
  'cat <file>  lire un fichier',
  'clear       nettoyer l\'écran',
  'exit        fermer le terminal',
];

const run = (raw: string): string[] | 'clear' | 'exit' => {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  switch (cmd) {
    case '': return [];
    case 'help': return HELP;
    case 'whoami': return ['pavel (curieux, ce qui est un excellent signe)'];
    case 'ls': {
      const all = args.some((a) => a.startsWith('-') && a.includes('a'));
      return [Object.keys(FILES).filter((f) => all || !f.startsWith('.')).join('   ')];
    }
    case 'cat': {
      if (!args[0]) return ['cat: quel fichier ?'];
      return FILES[args[0]] ?? [`cat: ${args[0]}: Aucun fichier de ce type`];
    }
    case 'sudo': return ['Vous êtes déjà root ici. Essayez "ls -a".'];
    case 'clear': return 'clear';
    case 'exit': return 'exit';
    default: return [`${cmd}: commande introuvable. Essayez "help".`];
  }
};

const INTRO = ['Accès accordé. Bienvenue sur le terminal caché.', 'Tapez "help" pour voir les commandes disponibles.'];

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

const SecretTerminal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(INTRO);
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) return;
    let typed = '';
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-SECRET.length);
      if (typed === SECRET) {
        e.preventDefault();
        setLines(INTRO);
        setValue('');
        setOpen(true);
        play('open');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    play('close');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value;
    setValue('');
    if (!v.trim()) return;
    const res = run(v);
    if (res === 'clear') {
      setLines([]);
    } else if (res === 'exit') {
      close();
    } else {
      setLines((prev) => [...prev, `$ ${v}`, ...res]);
    }
  };

  return createPortal(
    <div className="secret-terminal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="secret-terminal">
        <div className="secret-terminal__bar">
          <span className="secret-terminal__dot bg-red-500" onClick={close} />
          <span className="secret-terminal__dot bg-yellow-500" />
          <span className="secret-terminal__dot bg-green-500" />
          <span className="secret-terminal__title">pavel@terminal: ~</span>
        </div>
        <div ref={screen} className="secret-terminal__screen">
          {lines.map((l, i) => (
            <div key={i} className="secret-terminal__line">{l}</div>
          ))}
          <form onSubmit={submit} className="secret-terminal__prompt-line">
            <span className="secret-terminal__prompt">$</span>
            <input
              ref={input}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="secret-terminal__input"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SecretTerminal;
