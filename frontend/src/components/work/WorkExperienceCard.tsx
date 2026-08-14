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
  }));

  if (isOverlay) {
    return (
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-4 mb-2">
          {entry.companyLogo && (
            <img
              src={entry.companyLogo}
              alt={`${entry.companyName} logo`}
              className="w-12 h-12 rounded-md object-contain bg-white/5 shrink-0"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <div className="min-w-0">
            <h3 className="text-lg font-medium text-white truncate">{entry.jobTitle}</h3>
            <p className="text-sm text-neutral-400 truncate">
              {entry.companyName} {entry.location ? `· ${entry.location}` : ""}
            </p>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-6">
          {formatDateRange(entry.startDate, entry.endDate, entry.current)}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {entry.technologies.map((tech) => (
            <Chip key={tech.id} label={tech.name} />
          ))}
        </div>

        <div className="text-sm leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none break-words">
          <ReactMarkdown>{entry.description}</ReactMarkdown>
        </div>

        {mediaItems.length > 0 && (
          <div className="mt-8 mb-6 w-full max-w-2xl mx-auto">
            <MediaViewer items={mediaItems} />
          </div>
        )}

        {entry.companyWebsite && (
          <a 
            href={entry.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 self-start inline-flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
          >
            Visit company site →
          </a>
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
      <Card className="relative overflow-hidden transition-colors hover:bg-neutral-900/85 hover:border-neutral-700">
        <div className="flex justify-between gap-4 items-start min-w-0">
          <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
            {entry.companyLogo && (
              <img
                src={entry.companyLogo}
                alt={`${entry.companyName} logo`}
                className="w-10 h-10 rounded-md object-contain bg-white/5 shrink-0 mt-1"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-lg text-white group-hover:text-blue-300 transition-colors truncate">
                {entry.jobTitle}
              </h3>
              <p className="text-sm text-neutral-400 truncate">
                {entry.companyName} {entry.location ? `· ${entry.location}` : ""}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {formatDateRange(entry.startDate, entry.endDate, entry.current)}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
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
            className="text-xs text-neutral-400 hover:text-white shrink-0 self-start"
          >
            Expand
          </button>
        </div>
      </Card>
    </motion.div>
  );
}