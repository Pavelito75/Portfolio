import React from 'react';
import { useTranslation } from 'react-i18next';
import type { IconType } from 'react-icons';
import {
  SiLinux,
  SiDebian,
  SiUbuntu,
  SiGnubash,
  SiPython,
  SiC,
  SiDocker,
  SiProxmox,
  SiGit,
  SiWireshark,
  SiPfsense,
  SiWireguard,
  SiOpenvpn,
  SiJavascript,
  SiNodedotjs,
  SiPhp,
  SiSymfony,
  SiReact,
  SiPostman,
  SiMysql,
  SiPostgresql,
} from 'react-icons/si';
import { FaWindows, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';
import { asset } from '../utils/asset';

export interface TechItem {
  name: string;
  color: string;
  icon?: IconType;
  iconUrl?: string;
}

export interface TechGroup {
  key: string;
  items: TechItem[];
}

export const GROUPS: TechGroup[] = [
  {
    key: 'systems',
    items: [
      { name: 'Linux', color: '#FCC624', icon: SiLinux },
      { name: 'Debian', color: '#D70A53', icon: SiDebian },
      { name: 'Ubuntu', color: '#E95420', icon: SiUbuntu },
      { name: 'Bash', color: '#4EAA25', icon: SiGnubash },
      { name: 'Python', color: '#3776AB', icon: SiPython },
      { name: 'C', color: '#A8B9CC', icon: SiC },
    ],
  },
  {
    key: 'devops',
    items: [
      { name: 'Docker', color: '#2496ED', icon: SiDocker },
      { name: 'Proxmox VE', color: '#E57000', icon: SiProxmox },
      { name: 'Git & GitHub', color: '#F05032', icon: SiGit },
      { name: 'Windows', color: '#0078D6', icon: FaWindows },
    ],
  },
  {
    key: 'security',
    items: [
      { name: 'TCP/IP', color: '#00D2FF', icon: FaNetworkWired },
      { name: 'Wireshark', color: '#1679A7', icon: SiWireshark },
      { name: 'pfSense', color: '#22D3EE', icon: SiPfsense },
      { name: 'WireGuard', color: '#88171A', icon: SiWireguard },
      { name: 'OpenVPN', color: '#EA7E20', icon: SiOpenvpn },
      { name: 'Wazuh SIEM', color: '#00A4E4', icon: FaShieldAlt },
    ],
  },
  {
    key: 'web',
    items: [
      { name: 'JavaScript', color: '#F7DF1E', icon: SiJavascript },
      { name: 'Node.js', color: '#339933', icon: SiNodedotjs },
      { name: 'PHP', color: '#777BB4', icon: SiPhp },
      { name: 'Symfony', color: '#FFFFFF', icon: SiSymfony },
      { name: 'React', color: '#61DAFB', icon: SiReact },
      { name: 'Postman', color: '#FF6C37', icon: SiPostman },
      { name: 'MySQL', color: '#4479A1', icon: SiMysql },
      { name: 'PostgreSQL', color: '#4169E1', icon: SiPostgresql },
    ],
  },
];

export interface SkillStackProps {
  groups?: TechGroup[];
}

export const SkillStack: React.FC<SkillStackProps> = ({ groups = GROUPS }) => {
  const { t } = useTranslation();

  return (
    <div className="tech__grid flex flex-col gap-4 w-full">
      {groups.map((g) => (
        <div key={g.key} className="tech-panel" data-reveal>
          <div className="tech-panel__bar">
            <span className="tech-panel__path">~/stack/{g.key}</span>
            <span className="tech-panel__name">{t(`tech.groups.${g.key}`)}</span>
          </div>
          <ul className="tech-panel__list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-4">
            {g.items.map((tech) => (
              <li
                key={tech.name}
                className="tech-chip flex items-center gap-2"
                style={{ '--chip': tech.color } as React.CSSProperties}
              >
                {tech.icon ? (
                  <tech.icon size={20} style={{ color: tech.color }} aria-hidden />
                ) : tech.iconUrl ? (
                  <img src={asset(tech.iconUrl)} alt="" width={20} height={20} loading="lazy" />
                ) : null}
                <span>{tech.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const TechStack: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="tech-stack" className="w-full flex flex-col items-center bg-transparent relative" style={{ padding: '96px 0' }}>
      <div className="tech">
        <div className="text-center" style={{ marginBottom: '40px' }} data-reveal>
          <h2 data-index="03" className="section-title text-4xl font-bold tracking-tighter" style={{ color: 'var(--foreground)' }}>
            {t('tech.title')} <span className="section-title__accent">{t('tech.subtitle')}</span>
          </h2>
        </div>

        <SkillStack />
      </div>
    </section>
  );
};

export default TechStack;
