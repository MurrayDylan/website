import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { type PageResponse } from "../../api/responseTypes";
import { fetchSiteSettings, getCvDownloadUrl, createCvMediaItem } from "../../api/portfolioApi";
import { type SiteSettingsResponse } from "../../api/responseTypes";
import MediaViewer from "../shared/MediaViewer";
import Avatar from "../media/Avatar";
import { DiGithubBadge } from "react-icons/di";
import { AiFillLinkedin } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { staggerContainer, staggerItem } from "../../util/animation";

export default function AboutLayout({ page }: { page: PageResponse }) {
  const name = page.metadata?.name as string;
  const degree = page.metadata?.degree as string;
  const status = page.metadata?.status as string;
  const gradYear = page.metadata?.gradYear as string;
  const jobTitle = page.metadata?.jobTitle as string;
  const location = page.metadata?.location as string;
  const thesisArea = page.metadata?.thesisArea as string;
  const gradInstitution = page.metadata?.gradInstitution as string;

  const avatar = page.media?.[0];
  const additionalMedia = page.media?.slice(1) ?? [];

  // Parse standard page attachments
  const pageMediaItems = additionalMedia.map((item) => ({
    id: item.id,
    media: item.media,
    caption: item.caption ?? undefined,
    altText: item.altText ?? undefined,
  }));

  // USE CASE 2: Combine standard page media with our dynamic CV media item
  const allMediaItems = [
    createCvMediaItem("Curriculum Vitae"), // Embedded PDF Viewer
    ...pageMediaItems,
  ];

  const [settings, setSettings] = useState<SiteSettingsResponse | null>(null);

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch((err) => console.error("Failed to load site settings in about page", err));
  }, []);

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1 max-w-3xl mx-auto w-full py-4"
    >
      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row gap-6 items-start mb-6 pb-6 border-b border-neutral-800"
      >
        {avatar && (
          <Avatar media={avatar.media} altText={avatar.altText ?? undefined} />
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{name}</h1>

          {/* Badges and Dynamic Links */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {location && (
              <span className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded">
                 {location}
              </span>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded transition"
                title="Send Email"
              >
                <CiMail size={14} /> Email
              </a>
            )}
            {settings?.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded transition"
              >
                <AiFillLinkedin size={14} /> LinkedIn
              </a>
             )}
            {settings?.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded transition"
              >
                <DiGithubBadge size={14} /> GitHub
              </a>
            )}

            {/* USE CASE 1: Direct CV Download Badge */}
            <a
              href={getCvDownloadUrl()}
              download
              className="flex items-center gap-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded transition font-medium"
            >
              <HiOutlineDocumentDownload size={14} /> Download CV
            </a>

            {status && (
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded">
                {status}
              </span>
            )}
            {degree && (
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded">
                {degree}
              </span>
            )}
            {jobTitle && (
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded">
                {jobTitle}
              </span>
            )}
            {gradInstitution && (
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded">
                School: {gradInstitution} - {gradYear}
              </span>
            )}
            {thesisArea && (
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded">
                Thesis Area: {thesisArea}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {page.content && (
        <motion.div
          variants={staggerItem}
          className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed"
        >
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </motion.div>
      )}

      {/* Renders all media attachments including the dynamic embedded CV viewer */}
      {allMediaItems.length > 0 && (
        <motion.div variants={staggerItem} className="mt-8">
          <MediaViewer items={allMediaItems} />
        </motion.div>
      )}
    </motion.article>
  );
}