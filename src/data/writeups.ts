// Writeups et analyses techniques de Pavel Gatti
export const WRITEUPS_REPO = 'https://github.com/Pavelito75';

export interface Writeup {
  room: string;
  topics: string[];
  status: string;
}

export const WRITEUPS: Writeup[] = [
  {
    room: "En cours de rédaction",
    topics: ["Sécurité des réseaux", "Analyse de flux", "Wireshark & TCP/IP"],
    status: "En cours de rédaction",
  },
  {
    room: "En cours de rédaction",
    topics: ["Pare-feu & Filtrage", "Segmentation VLANs", "pfSense"],
    status: "En cours de rédaction",
  },
  {
    room: "En cours de rédaction",
    topics: ["SIEM & Détection d'intrusions", "Wazuh", "Corrélation de logs"],
    status: "En cours de rédaction",
  },
  {
    room: "En cours de rédaction",
    topics: ["Tunnels VPN sécurisés", "WireGuard & OpenVPN", "Chiffrement"],
    status: "En cours de rédaction",
  },
  {
    room: "En cours de rédaction",
    topics: ["Administration & Durcissement", "Systèmes Linux Debian", "Sécurité SSH"],
    status: "En cours de rédaction",
  },
  {
    room: "En cours de rédaction",
    topics: ["Virtualisation & Conteneurs", "Proxmox VE & Docker", "Isolation"],
    status: "En cours de rédaction",
  },
];
