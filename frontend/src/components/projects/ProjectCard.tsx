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

interface ProjectCardProps {
  project: ProjectResponse;
  isOverlay?: boolean;
  onToggleExpand: () => void;
}

export default function ProjectCard({
  project,
  isOverlay = false,
  onToggleExpand,
}: ProjectCardProps) {
  const mediaItems = [...(project.media ?? [])]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((item: ProjectMediaResponse) => ({
      id: item.id,
      media: item.media,
      caption: item.caption ?? undefined,
      altText: item.altText ?? undefined,
    }));

  // Expanded full-page view
  if (isOverlay) {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technologies.map((tech) => (
            <Chip key={tech.id} label={tech.name} />
          ))}
        </div>

        <div className="text-sm leading-7 text-neutral-300 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>

        {mediaItems.length > 0 && (
          <div className="mt-8 mb-6 w-full max-w-2xl mx-auto">
            <MediaViewer items={mediaItems} />
          </div>
        )}

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-6">
            {project.links.map((link) => (
              <ProjectLink key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard list card view
  return (
    <motion.div
      layout
      layoutId={`project-card-${project.id}`}
      onClick={onToggleExpand}
      className="cursor-pointer group"
    >
      <Card className="relative overflow-hidden transition-colors hover:bg-neutral-900/85 hover:border-neutral-700">
        <div className="flex justify-between gap-4">
          <div className="flex-1 pr-2">
            <h3 className="font-medium text-lg text-white group-hover:text-blue-300 transition-colors">
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-1.5 my-2">
              {project.technologies.map((tech) => (
                <Chip key={tech.id} label={tech.name} />
              ))}
            </div>

            <p className="text-sm text-neutral-400 line-clamp-2">
              {project.description}
            </p>
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