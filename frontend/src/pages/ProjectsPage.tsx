import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { usePortfolioData } from "../context/PortfolioContext";
import SearchBox from "../components/shared/SearchBox";
import ProjectCard from "../components/projects/ProjectCard";
import TechFilterCard from "../components/projects/TechFilterCard";
import { useTitleOverride } from "../context/TitleContext";
import { staggerContainer, staggerItem } from "../util/animation";

const PRIORITY_CATEGORIES = ["Language", "Framework & Library", "Data Science & ML"];

export default function ProjectsPage() {
  const { projects } = usePortfolioData();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<Set<string>>(new Set());
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  // Handle incoming tech filter from Skills page navigation state
  useEffect(() => {
    const state = location.state as { initialTech?: string } | null;
    if (state?.initialTech) {
      setSelectedTechs(new Set([state.initialTech]));
      // Clean up the history state so it doesn't re-trigger if filters are manually cleared later
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const groupedTechnologies = useMemo(() => {
    if (projects.status !== "success") return [];

    const byCategory = new Map<string, Set<string>>();
    projects.data.forEach((p) =>
      p.technologies.forEach((t) => {
        if (!byCategory.has(t.category)) byCategory.set(t.category, new Set());
        byCategory.get(t.category)!.add(t.name);
      })
    );

    const sortedCategories = Array.from(byCategory.keys()).sort((a, b) => {
      const aPriority = PRIORITY_CATEGORIES.indexOf(a);
      const bPriority = PRIORITY_CATEGORIES.indexOf(b);

      if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
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
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
      const projectTechNames = project.technologies.map((t) => t.name);
      const matchesFilters = Array.from(selectedTechs).every((tech) => projectTechNames.includes(tech));
      return matchesSearch && matchesFilters;
    });

    return filtered.sort((a, b) => a.displayOrder - b.displayOrder);
  }, [projects, searchTerm, selectedTechs]);

  const selectedProject =
    projects.status === "success" && expandedProjectId !== null
      ? projects.data.find((project) => project.id === expandedProjectId) ?? null
      : null;

  // Sync expanded state with title & header action button
  useEffect(() => {
    if (selectedProject) {
      setTitleOverride(`Projects/${selectedProject.title}`);
      setHeaderAction(
        <button
          onClick={() => setExpandedProjectId(null)}
          className="rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-1.5 text-sm text-neutral-300 transition hover:border-blue-400 hover:text-white"
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
      if (next.has(tech)) next.delete(tech);
      else next.add(tech);
      return next;
    });
  }

  if (projects.status === "loading") return <p>Loading projects…</p>;
  if (projects.status === "error") return <p>Couldn't load projects: {projects.message}</p>;
  if (projects.status === "not-implemented") return <p>Coming soon.</p>;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="relative min-h-full flex flex-col flex-1"
    >
      {!selectedProject ? (
        <>
          <motion.div variants={staggerItem} className="mb-4">
            <SearchBox value={searchTerm} onChange={setSearchTerm} placeholder="Search projects…" />
          </motion.div>

          <motion.div variants={staggerItem}>
            <TechFilterCard
              groups={groupedTechnologies}
              selected={selectedTechs}
              onToggle={toggleTechFilter}
            />
          </motion.div>

          <motion.div variants={staggerItem} className="flex flex-col gap-4 flex-1 pr-1">
            {filteredProjects.length === 0 && <p className="text-neutral-500 text-sm">No projects match your search/filters.</p>}
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
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
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col pt-2"
          >
            <ProjectCard
              project={selectedProject}
              isOverlay={true}
              onToggleExpand={() => setExpandedProjectId(null)}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}