import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const canAnimate = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Écrit et efface chaque rôle, l'un après l'autre, comme quelqu'un qui tape au clavier
const TypedRoles: React.FC<{ roles: string[] }> = ({ roles }) => {
  const [animate] = useState(canAnimate);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [erasing, setErasing] = useState(false);
  const role = roles[index % roles.length] ?? '';

  useEffect(() => {
    if (!animate || roles.length < 2) return;
    const full = count === role.length;
    // Pause avec le rôle complet à l'écran, puis efface plus rapidement qu'il n'a écrit
    const delay = !erasing && full ? 1800 : erasing ? 35 : 75;
    const id = setTimeout(() => {
      if (!erasing && full) setErasing(true);
      else if (erasing && count === 0) {
        setErasing(false);
        setIndex((i) => (i + 1) % roles.length);
      } else setCount((c) => c + (erasing ? -1 : 1));
    }, delay);
    return () => clearTimeout(id);
  }, [animate, roles.length, role, count, erasing]);

  if (!animate || roles.length < 2) return <>{roles.join(' & ')}</>;
  return (
    <>
      {/* Lecteurs d'écran reçoivent les rôles en entier sans animation */}
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">
        {role.slice(0, Math.min(count, role.length))}
        <span className="hero-caret" />
      </span>
    </>
  );
};

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const roles = t('hero.roles', { returnObjects: true }) as string[];

  return (
    <section id="hero" className="hero">
      <div className="hero__inner">
        <div className="hero__text">
          <p className="hero__status">
            <span className="hero-status__dot" aria-hidden />
            {t('hero.status')}
          </p>

          <h1 className="hero__name">Pavel Gatti</h1>

          {/* Rôle tapé comme dans un terminal avec curseur animé */}
          <h2 className="hero__role">
            <span className="hero__prompt" aria-hidden>&gt;</span>
            <TypedRoles key={i18n.language} roles={Array.isArray(roles) && roles.length > 0 ? roles : [t('hero.role')]} />
          </h2>

          <p className="hero__desc">{t('hero.description')}</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
