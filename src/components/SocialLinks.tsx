import React from 'react';
import { FaGithub, FaLinkedin, FaFilePdf } from 'react-icons/fa';

export const LINKS = [
  { label: 'GitHub', href: 'https://github.com/Pavelito75', Icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pavelgatti/', Icon: FaLinkedin },
  { label: 'Télécharger mon CV', href: 'cv.pdf', Icon: FaFilePdf, download: 'CV_Pavel_Gatti.pdf' },
] as const;

interface SocialLinksProps {
  size?: number;
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ size = 28, className = '' }) => (
  <div className={`flex items-center justify-center gap-8 ${className}`}>
    {LINKS.map(({ label, href, Icon, ...rest }) => (
      <a
        key={label}
        href={href}
        download={'download' in rest ? (rest as { download?: string }).download : undefined}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        aria-label={label}
        title={label}
        className="transition-transform duration-300 hover:scale-110 hover:text-cyan-400"
        style={{ color: 'var(--text-muted)' }}
      >
        <Icon size={size} />
      </a>
    ))}
  </div>
);

export default SocialLinks;
