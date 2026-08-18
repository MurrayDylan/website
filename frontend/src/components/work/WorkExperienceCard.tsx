import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { type WorkExperienceResponse } from "../../api/responseTypes";
import { formatDateRange } from "../../util/formatDate";
import Card from "../shared/Card";
import Chip from "../shared/Chip";
import MediaViewer from "../shared/MediaViewer";

interface WorkExperienceCardProps {
  entry: WorkExperienceResponse;
  isOverlay?: boolean;
  onToggleExpand: () => void;
}

export default function WorkExperienceCard({
  entry,
  isOverlay = false,
  onToggleExpand,
}: WorkExperienceCardProps) {
  const sortedMedia = [...(entry.media ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const mediaItems = sortedMedia.map((item) => ({
    id: item.id,
    media: item.media,
    caption: item.caption ?? undefined,
    altText: item.altText ?? undefined,
    isHorizontal: item.isHorizontal,
  }));

  if (isOverlay) {
    return (
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-4 sm:gap-5">
          {entry.companyLogo && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={entry.companyLogo}
                alt={`${entry.companyName} logo`}
                className="w-full h-full rounded-md object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl font-medium text-white break-words">
              {entry.jobTitle}
            </h3>

            <p className="text-base text-neutral-400 break-words mt-0.5">
              {entry.companyName}
              {entry.location ? ` · ${entry.location}` : ""}
            </p>

            <p className="text-sm text-neutral-500 mt-1.5">
              {formatDateRange(
                entry.startDate,
                entry.endDate,
                entry.current
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-6">
          {entry.technologies.map((tech) => (
            <Chip key={tech.id} label={tech.name} />
          ))}

          {entry.companyWebsite && (
            <a
              href={entry.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-neutral-700/60 bg-neutral-800/40 px-4 py-1.5 text-sm font-medium text-neutral-300 transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:text-white"
            >
              Company site →
            </a>
          )}
        </div>

        <div className="mt-8 text-base leading-8 text-neutral-300 prose prose-invert prose-base max-w-none break-words">
          <ReactMarkdown>{entry.description}</ReactMarkdown>
        </div>

        {mediaItems.length > 0 && (
          <div className="mt-8 sm:mt-10 mb-7 w-full max-w-4xl mx-auto">
            <MediaViewer items={mediaItems} />
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      layout
      layoutId={`work-card-${entry.id}`}
      onClick={onToggleExpand}
      className="cursor-pointer group min-w-0"
    >
      <Card className="relative overflow-hidden p-4 sm:p-5 transition-colors hover:bg-neutral-900/85 hover:border-neutral-700">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-5 sm:items-start min-w-0">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            {entry.companyLogo && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                <img
                  src={entry.companyLogo}
                  alt={`${entry.companyName} logo`}
                  className="w-full h-full rounded-md object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-xl text-white group-hover:text-blue-300 transition-colors break-words">
                {entry.jobTitle}
              </h3>

              <p className="text-base text-neutral-400 break-words mt-0.5">
                {entry.companyName}
                {entry.location ? ` · ${entry.location}` : ""}
              </p>

              <p className="text-sm text-neutral-500 mt-1.5">
                {formatDateRange(
                  entry.startDate,
                  entry.endDate,
                  entry.current
                )}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {entry.technologies.map((tech) => (
                  <Chip key={tech.id} label={tech.name} />
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="self-start sm:mt-0 rounded-full px-3 py-1.5 -ml-3 sm:ml-0 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            Expand →
          </button>
        </div>
      </Card>
    </motion.div>
  );
}