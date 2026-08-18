import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useOutletContext } from "react-router-dom";
import { usePortfolioData } from "../context/PortfolioContext";
import SearchBox from "../components/shared/SearchBox";
import ProjectCard from "../components/projects/ProjectCard";
import TechFilterCard from "../components/projects/TechFilterCard";
import { useTitleOverride } from "../context/TitleContext";
import { staggerContainer, staggerItem } from "../util/animation";
import type { LayoutMode } from "../components/layout/AppShell";

interface ProjectsOutletContext {
  layoutMode: LayoutMode;
}

const PRIORITY_CATEGORIES = [
  "Language",
  "Framework & Library",
  "Data Science & ML",
];

export default function ProjectsPage() {
  const { projects } = usePortfolioData();
  const location = useLocation();
  const { layoutMode } = useOutletContext<ProjectsOutletContext>();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set());
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  useEffect(() => {
    const state = location.state as { initialTech?: string } | null;

    if (state?.initialTech) {
      setSelectedTechs(new Set([state.initialTech]));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const groupedTechnologies = useMemo(() => {
    if (projects.status !== "success") return [];

    const byCategory = new Map<string, Set<string>>();

    projects.data.forEach((project) =>
      project.technologies.forEach((technology) => {
        if (!byCategory.has(technology.category)) {
          byCategory.set(technology.category, new Set());
        }

        byCategory.get(technology.category)!.add(technology.name);
      })
    );

    const sortedCategories = Array.from(byCategory.keys()).sort((a, b) => {
      const aPriority = PRIORITY_CATEGORIES.indexOf(a);
      const bPriority = PRIORITY_CATEGORIES.indexOf(b);

      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }

      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;

      return a.localeCompare(b);
    });

    return sortedCategories.map((category) => ({
      category,
      technologies: Array.from(byCategory.get(category)!).sort((a, b) =>
        a.localeCompare(b)
      ),
    }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (projects.status !== "success") return [];

    const filtered = projects.data.filter((project) => {
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const projectTechNames = project.technologies.map(
        (technology) => technology.name
      );

      const matchesFilters = Array.from(selectedTechs).every((tech) =>
        projectTechNames.includes(tech)
      );

      return matchesSearch && matchesFilters;
    });

    return filtered.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [projects, searchTerm, selectedTechs]);

  const selectedProject =
    projects.status === "success" && expandedProjectId !== null
      ? projects.data.find((project) => project.id === expandedProjectId) ?? null
      : null;

  useEffect(() => {
    if (selectedProject) {
      setTitleOverride(`Projects/${selectedProject.title}`);

      setHeaderAction(
        <button
          onClick={() => setExpandedProjectId(null)}
          className="rounded-full border border-neutral-700 bg-neutral-900/90 px-5 py-2 text-sm text-neutral-300 transition hover:border-blue-400 hover:text-white"
        >
          Close
        </button>
      );
    } else {
      setTitleOverride(null);
      setHeaderAction(null);
    }

    return () => {
      setTitleOverride(null);
      setHeaderAction(null);
    };
  }, [selectedProject, setTitleOverride, setHeaderAction]);

  function toggleTechFilter(tech: string) {
    setSelectedTechs((prev) => {
      const next = new Set(prev);

      if (next.has(tech)) {
        next.delete(tech);
      } else {
        next.add(tech);
      }

      return next;
    });
  }

  if (projects.status === "loading") {
    return <p className="text-base">Loading projects…</p>;
  }

  if (projects.status === "error") {
    return (
      <p className="text-base">
        Couldn't load projects: {projects.message}
      </p>
    );
  }

  if (projects.status === "not-implemented") {
    return <p className="text-base">Coming soon.</p>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="relative min-h-full flex flex-col flex-1"
    >
      {!selectedProject ? (
        <>
          <motion.div variants={staggerItem} className="mb-5">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search projects…"
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <TechFilterCard
              groups={groupedTechnologies}
              selected={selectedTechs}
              onToggle={toggleTechFilter}
            />
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-5 flex-1 pr-1 mt-1"
          >
            {filteredProjects.length === 0 && (
              <p className="text-neutral-500 text-base">
                No projects match your search/filters.
              </p>
            )}

            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
              >
                <ProjectCard
                  project={project}
                  layoutMode={layoutMode}
                  onToggleExpand={() => setExpandedProjectId(project.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="flex-1 flex flex-col pt-2"
          >
            <ProjectCard
              project={selectedProject}
              isOverlay={true}
              layoutMode={layoutMode}
              onToggleExpand={() => setExpandedProjectId(null)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}