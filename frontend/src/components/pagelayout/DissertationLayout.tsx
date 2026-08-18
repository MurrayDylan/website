import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { type PageResponse } from "../../api/responseTypes";
import MediaViewer from "../shared/MediaViewer";
import { staggerContainer, staggerItem } from "../../util/animation";

const PPT_MIME_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

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
    ? rawGithubUrl.startsWith("http://") ||
      rawGithubUrl.startsWith("https://")
      ? rawGithubUrl
      : `https://${rawGithubUrl}`
    : undefined;

  const sortedMedia = [...(page.media ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  // Filters both PDFs and PowerPoint presentations into the document section
  const documentMediaItems = sortedMedia
  .filter(
    (item) =>
      item.media.contentType === "application/pdf" ||
      PPT_MIME_TYPES.includes(item.media.contentType)
  )
  .map((item) => ({
    id: item.id,
    media: item.media,
    caption: item.caption ?? undefined,
    altText: item.altText ?? undefined,
    isHorizontal: item.isHorizontal, // 👈 Added here
  }));

const chartMediaItems = sortedMedia
  .filter((item) => item.media.contentType.startsWith("image/"))
  .map((item) => ({
    id: item.id,
    media: item.media,
    caption: item.caption ?? undefined,
    altText: item.altText ?? undefined,
    isHorizontal: item.isHorizontal, // 👈 Added here
  }));

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
      className="flex flex-col flex-1 max-w-5xl mx-auto w-full py-5"
    >
      <motion.header
        variants={staggerItem}
        className="mb-8 pb-7 border-b border-neutral-800/60"
      >
        <h1 className="text-4xl font-bold text-neutral-100 mt-2 mb-2">
          {dissertationTitle}
        </h1>

        {page.subtitle && (
          <p className="text-lg text-neutral-400 mt-2">
            {page.subtitle}
          </p>
        )}

        <div className="flex flex-wrap gap-3 items-center mt-6 text-sm">
          {degree && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-3 py-2 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Degree:</span> {degree}
            </span>
          )}

          <span className="bg-neutral-800/50 border border-neutral-700/50 px-3 py-2 rounded-md text-neutral-300">
            <span className="text-neutral-500 mr-1">Field:</span> Machine Learning
          </span>

          {supervisor && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-3 py-2 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Supervisor:</span>{" "}
              {supervisor}
            </span>
          )}

          {datasetName && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-3 py-2 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Dataset:</span>{" "}
              {datasetName}
            </span>
          )}

          {grade && (
            <span className="bg-neutral-800/50 border border-neutral-700/50 px-3 py-2 rounded-md text-neutral-300">
              <span className="text-neutral-500 mr-1">Grade:</span> {grade}
            </span>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 border border-transparent hover:border-neutral-700/50 rounded-md"
            >
              GitHub Repository
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}

          {documentMediaItems.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection("full-dissertation")}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/40 hover:bg-neutral-700/60 border border-neutral-700/50 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              Read Documents & Slides
            </button>
          )}

          {chartMediaItems.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection("charts-figures")}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/40 hover:bg-neutral-700/60 border border-neutral-700/50 hover:border-neutral-600 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              View Charts
            </button>
          )}
        </div>
      </motion.header>

      {page.content && (
        <motion.div
          variants={staggerItem}
          className="prose prose-invert prose-base max-w-none text-neutral-300 leading-8 mb-14"
        >
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-5">
            Abstract
          </h2>
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </motion.div>
      )}

      {documentMediaItems.length > 0 && (
        <motion.section
          id="full-dissertation"
          variants={staggerItem}
          className="mt-5 mb-20 scroll-mt-12"
        >
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-7">
            Documents & Presentations
          </h2>

          <MediaViewer items={documentMediaItems} />
        </motion.section>
      )}

      {chartMediaItems.length > 0 && (
        <motion.section
          id="charts-figures"
          variants={staggerItem}
          className="mt-5 mb-10 scroll-mt-12"
        >
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-7">
            Charts & Figures
          </h2>

          <MediaViewer items={chartMediaItems} />
        </motion.section>
      )}
    </motion.article>
  );
}