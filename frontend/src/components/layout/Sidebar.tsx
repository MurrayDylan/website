import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { DiGithubBadge } from "react-icons/di";
import { AiFillLinkedin } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { fetchSiteSettings, getCvDownloadUrl } from "../../api/portfolioApi";
import { type SiteSettingsResponse } from "../../api/responseTypes";

const navItems = [
  { label: "About Me", path: "/about" },
  { label: "Education", path: "/education" },
  { label: "Work Experience", path: "/work" },
  { label: "Projects", path: "/projects" },
  { label: "Skills", path: "/skills" },
  { label: "Contact Me", path: "/contact" },
  { label: "Masters Dissertation", path: "/dissertation" },
  { label: "About This Website", path: "/about-this-website" },
];

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export default function Sidebar({ onClose, className = "w-full md:w-64" }: SidebarProps) {
  const [settings, setSettings] = useState<SiteSettingsResponse | null>(null);
  const isMobileOverlay = Boolean(onClose);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch((err) => console.error("Failed to load site settings in sidebar", err));
  }, []);

  return (
    <aside className={`${className} shrink-0 rounded-xl bg-neutral-900 text-neutral-100 shadow-lg p-6 flex flex-col h-full box-border border border-neutral-800`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Dylan Murray</h1>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      <nav className={`flex flex-col flex-1 overflow-y-auto custom-scrollbar ${isMobileOverlay ? "gap-2" : "gap-1"}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              isMobileOverlay
                ? `px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-neutral-800 text-white font-semibold"
                      : "text-neutral-300 bg-neutral-800/30 hover:bg-neutral-800/60"
                  }`
                : `px-3 py-2 rounded-r-md text-sm transition-colors border-l-2 ${
                    isActive
                      ? "border-blue-400 bg-neutral-800 text-white"
                      : "border-transparent text-neutral-400 hover:text-white hover:border-neutral-600"
                  }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-neutral-700 flex flex-row items-center justify-between gap-3 text-sm text-neutral-400">
        {settings?.email && (
          <a
            href={`mailto:${settings.email}`} 
            className="hover:text-white transition-colors" 
            aria-label="Email"
          >
            <CiMail size={20} />
          </a>
        )}
        
        {settings?.linkedinUrl && (
          <a 
            href={settings.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
            className="hover:text-white transition-colors"
          >
            <AiFillLinkedin size={20} />
          </a>
        )}

        {settings?.githubUrl && (
          <a 
            href={settings.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <DiGithubBadge size={20} />
          </a>
        )}

        <a 
          href={getCvDownloadUrl()} 
          download 
          aria-label="Download CV"
          className="hover:text-white transition-colors font-medium"
        >
          CV
        </a>
      </div>
    </aside>
  );
}