import { motion } from "framer-motion";
import {
  type ProjectResponse,
  type ProjectMediaResponse,
} from "../../api/responseTypes";
import ReactMarkdown from "react-markdown";
import Card from "../shared/Card";
import Chip from "../shared/Chip";
import ProjectLink from "../shared/ProjectLink";
import MediaViewer from "../shared/MediaViewer";
import type { LayoutMode } from "../layout/AppShell";

interface ProjectCardProps {
  project: ProjectResponse;
  isOverlay?: boolean;
  layoutMode: LayoutMode;
  onToggleExpand: () => void;
}

export default function ProjectCard({
  project,
  isOverlay = false,
  layoutMode,
  onToggleExpand,
}: ProjectCardProps) {
  const isMobile = layoutMode === "mobile";

  const mediaItems = [...(project.media ?? [])]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item: ProjectMediaResponse) => ({
      id: item.id,
      media: item.media,
      caption: item.caption ?? undefined,
      altText: item.altText ?? undefined,
      isHorizontal: item.isHorizontal,
    }));

  if (isOverlay) {
    return (
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {project.technologies.map((tech) => (
            <Chip key={tech.id} label={tech.name} />
          ))}

          {project.links.length > 0 && (
            <>
              <div className="h-5 w-px bg-neutral-700 mx-1" />

              {project.links.map((link) => (
                <ProjectLink
                  key={link.id}
                  link={link}
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-700/60 bg-neutral-800/40 px-3.5 py-1.5 text-sm font-medium text-neutral-300 transition-all hover:border-neutral-600 hover:bg-neutral-800 hover:text-white"
                />
              ))}
            </>
          )}
        </div>

        <div className="text-base leading-8 text-neutral-300 prose prose-invert prose-base max-w-none break-words">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>

        {mediaItems.length > 0 && (
          <div
            className={`mt-8 sm:mt-10 mb-7 w-full mx-auto ${
              isMobile ? "max-w-full" : "max-w-4xl"
            }`}
          >
            <MediaViewer items={mediaItems} />
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      layout
      layoutId={`project-card-${project.id}`}
      onClick={onToggleExpand}
      className="cursor-pointer group min-w-0"
    >
      <Card className="relative overflow-hidden p-4 sm:p-5 transition-colors hover:bg-neutral-900/85 hover:border-neutral-700">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-5">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-xl text-white group-hover:text-blue-300 transition-colors break-words">
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-2 my-3">
              {project.technologies.map((tech) => (
                <Chip key={tech.id} label={tech.name} />
              ))}
            </div>

            <p className="text-base text-neutral-400 line-clamp-2 leading-7">
              {project.description}
            </p>
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