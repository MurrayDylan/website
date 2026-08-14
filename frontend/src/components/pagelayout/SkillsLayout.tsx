import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { type PageResponse, type TechnologyResponse } from "../../api/responseTypes";
import { fetchTechnologies } from "../../api/portfolioApi";
import { staggerContainer, staggerItem } from "../../util/animation";
import { useEffect, useState, useMemo } from "react";

const PRIORITY_CATEGORIES = ["Language", "Framework & Library", "Data Science & ML"];

export default function SkillsLayout({ page }: { page: PageResponse }) {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState<TechnologyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTechnologies()
      .then(setTechnologies)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load technologies"))
      .finally(() => setLoading(false));
  }, []);

  const groupedTechnologies = useMemo(() => {
    const byCategory = new Map<string, string[]>();
    technologies.forEach((t) => {
      if (!byCategory.has(t.category)) byCategory.set(t.category, []);
      byCategory.get(t.category)!.push(t.name);
    });

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
      technologies: byCategory.get(category)!.sort((a, b) => a.localeCompare(b)),
    }));
  }, [technologies]);

  function handleSkillClick(techName: string) {
    navigate("/projects", { state: { initialTech: techName } });
  }

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1 max-w-3xl mx-auto w-full py-4"
    >
      {page.content && (
        <motion.div
          variants={staggerItem}
          className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed mb-8"
        >
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </motion.div>
      )}

      {loading && (
        <motion.p variants={staggerItem} className="text-neutral-500 text-sm">
          Loading technologies…
        </motion.p>
      )}

      {error && (
        <motion.p variants={staggerItem} className="text-red-400 text-sm">
          Could not load technologies: {error}
        </motion.p>
      )}

      {!loading && !error && groupedTechnologies.length > 0 && (
        <div className="flex flex-col gap-5">
          {groupedTechnologies.map((group, index) => (
            <motion.section
              key={group.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.12 }}
              className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 flex flex-col gap-3"
            >
              <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                {group.category}
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {group.technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleSkillClick(tech)}
                    className="text-xs bg-neutral-800/80 hover:bg-neutral-700/80 hover:border-blue-400 border border-neutral-700/60 text-neutral-300 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer text-left"
                    title={`View projects built with ${tech}`}
                  >
                    {tech} →
                  </button>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </motion.article>
  );
}