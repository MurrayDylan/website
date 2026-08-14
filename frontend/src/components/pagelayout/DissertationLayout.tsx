import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { type PageResponse } from "../../api/responseTypes";
import MediaViewer from "../shared/MediaViewer";
import { staggerContainer, staggerItem } from "../../util/animation";

export default function DissertationLayout({
  page,
}: {
  page: PageResponse;
}) {
  const degree =
    (page.metadata?.degree as string) || "Master's Dissertation";

  const dissertationTitle = page.metadata?.title as string;
  const grade = page.metadata?.grade as string;
  const supervisor = page.metadata?.supervisor as string;
  const datasetName = page.metadata?.datasetName as string;
  
  const rawGithubUrl = page.metadata?.githubUrl as string;
  const githubUrl = rawGithubUrl
    ? rawGithubUrl.startsWith("http://") || rawGithubUrl.startsWith("https://")
      ? rawGithubUrl
      : `https://${rawGithubUrl}`
    : undefined;

  const sortedMedia = [...(page.media ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const pdfMediaItems = sortedMedia
    .filter((item) => item.media.contentType === "application/pdf")
    .map((item) => ({
      id: item.id,
      media: item.media,
      caption: item.caption ?? undefined,
      altText: item.altText ?? undefined,
    }));

  const chartMediaItems = sortedMedia
    .filter((item) => item.media.contentType.startsWith("image/"))
    .map((item) => ({
      id: item.id,
      media: item.media,
      caption: item.caption ?? undefined,
      altText: item.altText ?? undefined,
    }));

  // Smooth scroll handler without modifying the URL
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1 max-w-3xl mx-auto w-full py-4"
    >
      <motion.header
        variants={staggerItem}
        className="mb-6 pb-5 border-b border-neutral-800/60"
      >

        <h1 className="text-3xl font-bold text-neutral-100 mt-2 mb-1">
          {dissertationTitle}
        </h1>

        {page.subtitle && (
          <p className="text-base text-neutral-400 mt-1">
            {page.subtitle}
          </p>
        )}

        <div className="flex flex-wrap gap-2.5 items-center mt-5 text-xs">
          {degree && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1.5 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Degree:</span> {degree}
            </span>
          )}

          <span className="bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1.5 rounded-md text-neutral-300">
            <span className="text-neutral-500 mr-1">Field:</span> Machine Learning
          </span>

          {supervisor && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1.5 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Supervisor:</span> {supervisor}
            </span>
          )}

          {datasetName && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1.5 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Dataset:</span> {datasetName}
            </span>
          )}

          {grade && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1.5 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Grade:</span> {grade}
            </span>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 border border-transparent hover:border-neutral-700/50 rounded-md"
            >
              GitHub Repository
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {/* --- BUTTON JUMP PIPS (NO URL HASH CHANGE) --- */}
          {pdfMediaItems.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection("full-dissertation")}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/40 hover:bg-neutral-700/60 border border-neutral-700/50 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Read Document
            </button>
          )}

          {chartMediaItems.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection("charts-figures")}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800/40 hover:bg-neutral-700/60 border border-neutral-700/50 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              View Charts
            </button>
          )}
        </div>
      </motion.header>

      {page.content && (
        <motion.div
          variants={staggerItem}
          className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed mb-12"
        >
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">
            Abstract
          </h2>
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </motion.div>
      )}

      {pdfMediaItems.length > 0 && (
        <motion.section 
          id="full-dissertation" 
          variants={staggerItem} 
          className="mt-4 mb-16 scroll-mt-12"
        >
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">
            Dissertation Document
          </h2>

          <MediaViewer items={pdfMediaItems} />
        </motion.section>
      )}

      {chartMediaItems.length > 0 && (
        <motion.section 
          id="charts-figures" 
          variants={staggerItem} 
          className="mt-4 mb-8 scroll-mt-12"
        >
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">
            Charts & Figures
          </h2>

          <MediaViewer items={chartMediaItems} />
        </motion.section>
      )}
    </motion.article>
  );
}