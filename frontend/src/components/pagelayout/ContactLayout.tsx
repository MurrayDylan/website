import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { DiGithubBadge } from "react-icons/di";
import { AiFillLinkedin } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { fetchSiteSettings } from "../../api/portfolioApi";
import { type SiteSettingsResponse, type PageResponse } from "../../api/responseTypes";
import { staggerContainer, staggerItem } from "../../util/animation";

export default function ContactLayout({ page }: { page?: PageResponse }) {
  const [settings, setSettings] = useState<SiteSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load contact information")
      )
      .finally(() => setLoading(false));
  }, []);

  function handleCopyEmail() {
    if (settings?.email) {
      navigator.clipboard.writeText(settings.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1 max-w-3xl mx-auto w-full py-4"
    >
      {page?.content && (
        <motion.div
          variants={staggerItem}
          className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed mb-10"
        >
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </motion.div>
      )}

      {loading && (
        <motion.p variants={staggerItem} className="text-neutral-500">
          Loading contact details…
        </motion.p>
      )}

      {error && (
        <motion.p variants={staggerItem} className="text-red-400">
          {error}
        </motion.p>
      )}

      {!loading && !error && settings && (
        <div className="flex flex-col gap-10">
          
          <motion.div variants={staggerItem} className="flex items-center gap-3 text-neutral-300">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <p>Based in Ireland (GMT) • Open to new opportunities</p>
          </motion.div>

          {settings.email && (
            <motion.div variants={staggerItem} className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-white">Email</h2>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-lg text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <CiMail size={24} />
                  {settings.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm rounded-md transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          )}

          <motion.div variants={staggerItem} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white">Connect</h2>
            
            <div className="flex flex-wrap gap-4">
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors"
                >
                  <AiFillLinkedin size={22} className="text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </a>
              )}

              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors"
                >
                  <DiGithubBadge size={24} />
                  <span>GitHub</span>
                </a>
              )}

              {settings.socialOne && (
                <a
                  href={settings.socialOne}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors"
                >
                  <span>Link 1 ↗</span>
                </a>
              )}

              {settings.socialTwo && (
                <a
                  href={settings.socialTwo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors"
                >
                  <span>Link 2 ↗</span>
                </a>
              )}

              {settings.socialThree && (
                <a
                  href={settings.socialThree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors"
                >
                  <span>Link 3 ↗</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.article>
  );
}