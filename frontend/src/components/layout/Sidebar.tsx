import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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
];

interface SidebarProps {
  onClose?: () => void;
  className?: string;
  mobileView?: boolean;
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Sidebar({
  onClose,
  className = "w-full md:w-72",
  mobileView = false,
}: SidebarProps) {
  const [settings, setSettings] = useState<SiteSettingsResponse | null>(null);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch((err) =>
        console.error("Failed to load site settings in sidebar", err)
      );
  }, []);

  if (mobileView) {
    return (
      <div className={`${className} flex flex-col flex-1 min-h-0`}>
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
                delayChildren: 0.05,
              },
            },
          }}
          className="flex flex-col gap-2.5"
        >
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              variants={itemVariants}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-3.5 rounded-lg text-base transition-colors ${
                    isActive
                      ? "bg-neutral-800 text-white font-semibold"
                      : "text-neutral-300 bg-neutral-800/30 hover:bg-neutral-800/60"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.55,
            ease: "easeOut",
          }}
          className="mt-auto pt-5 pb-[env(safe-area-inset-bottom)] border-t border-neutral-700 flex flex-row items-center justify-between gap-3 text-base text-neutral-400"
        >
          {settings?.email && (
            <a
              href={`mailto:${settings.email}`}
              className="hover:text-white transition-colors"
              aria-label="Email"
            >
              <CiMail size={24} />
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
              <AiFillLinkedin size={24} />
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
              <DiGithubBadge size={24} />
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
        </motion.div>
      </div>
    );
  }

  return (
    <aside
      className={`${className} shrink-0 rounded-xl bg-neutral-900 text-neutral-100 shadow-lg p-7 flex flex-col h-full box-border border border-neutral-800`}
    >
      <div className="flex items-center justify-between mb-9">
        <h1 className="text-2xl font-semibold">Dylan Murray</h1>
      </div>

      <nav className="flex flex-col flex-1 overflow-y-auto custom-scrollbar gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-r-md text-base transition-colors border-l-2 ${
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

      <div className="pt-5 border-t border-neutral-700 flex flex-row items-center justify-between gap-3 text-base text-neutral-400">
        {settings?.email && (
          <a
            href={`mailto:${settings.email}`}
            className="hover:text-white transition-colors"
            aria-label="Email"
          >
            <CiMail size={24} />
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
            <AiFillLinkedin size={24}
            />
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
            <DiGithubBadge size={24} />
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