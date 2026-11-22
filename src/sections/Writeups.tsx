import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiClock, FiGithub } from 'react-icons/fi';
import { WRITEUPS, WRITEUPS_REPO } from '../data/writeups';

const SHOWN = 6;

const Writeups: React.FC = () => {
  const { t } = useTranslation();
  const latest = [...WRITEUPS].slice(0, SHOWN);

  return (
    <section id="writeups" className="w-full flex flex-col items-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center" style={{ padding: '0 32px', marginBottom: '12px' }} data-reveal>
        <h2 data-index="05" className="section-title text-4xl font-bold tracking-tighter" style={{ color: 'var(--foreground)' }}>
          {t('writeups.title')} <span className="section-title__accent">{t('writeups.subtitle')}</span>
        </h2>
      </div>
      <p className="writeups__intro" data-reveal>{t('writeups.intro')}</p>

      <ul className="writeups">
        {latest.map((w, i) => (
          <li key={i} data-reveal>
            <div className="writeup">
              <span className="writeup__number">{String(i + 1).padStart(2, '0')}</span>
              <span className="writeup__body">
                <div className="flex items-center gap-2">
                  <span className="writeup__room">{w.room}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
                    <FiClock size={10} aria-hidden />
                    {w.status}
                  </span>
                </div>
                <span className="writeup__topics">{w.topics.join(' · ')}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <a className="writeups__all" href={WRITEUPS_REPO} target="_blank" rel="noopener noreferrer" data-reveal>
        <FiGithub aria-hidden /> {t('writeups.all', { count: WRITEUPS.length })}
      </a>
    </section>
  );
};

export default Writeups;
