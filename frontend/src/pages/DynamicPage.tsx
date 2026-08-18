import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchPageBySlug } from "../api/portfolioApi";
import { type PageResponse } from "../api/responseTypes";
import { useTitleOverride } from "../context/TitleContext";
import { staggerContainer, staggerItem } from "../util/animation";

import DissertationLayout from "../components/pagelayout/DissertationLayout";
import AboutLayout from "../components/pagelayout/AboutLayout";
import ContactLayout from "../components/pagelayout/ContactLayout";
import StandardLayout from "../components/pagelayout/StandardLayout";
import AboutThisWebsiteLayout from "../components/pagelayout/AboutThisWebsite";
import SkillsLayout from "../components/pagelayout/SkillsLayout";
import ModularLayout from "../components/pagelayout/ModularLayout";

interface DynamicPageProps {
  forcedSlug?: string;
}

export default function DynamicPage({ forcedSlug }: DynamicPageProps) {
  const params = useParams<{ slug: string }>();
  const slug = forcedSlug || params.slug;

  const [page, setPage] = useState<PageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setTitleOverride } = useTitleOverride();

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    fetchPageBySlug(slug)
      .then((data) => {
        setPage(data);
        setTitleOverride(data.title);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Page not found");
      })
      .finally(() => setLoading(false));

    return () => setTitleOverride(null);
  }, [slug, setTitleOverride]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 text-base">
        Loading page…
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-3">
        <p className="text-xl font-medium text-white">404 - Page Not Found</p>
        <p className="text-base text-neutral-500">
          The requested page "{slug}" could not be loaded.
        </p>
      </div>
    );
  }

  let layoutContent;

  switch (page.layoutType) {
    case "MODULAR":
      layoutContent = <ModularLayout page={page} />;
      break;

    case "DISSERTATION":
      layoutContent = <DissertationLayout page={page} />;
      break;

    case "ABOUT":
      layoutContent = <AboutLayout page={page} />;
      break;

    case "CONTACT":
      layoutContent = <ContactLayout page={page} />;
      break;

    case "ABOUT-THIS-WEBSITE":
      layoutContent = <AboutThisWebsiteLayout page={page} />;
      break;

    case "SKILLS":
      layoutContent = <SkillsLayout page={page} />;
      break;

    case "STANDARD":
    default:
      layoutContent = <StandardLayout page={page} />;
      break;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col"
    >
      <motion.div variants={staggerItem} className="flex-1 flex flex-col">
        {layoutContent}
      </motion.div>
    </motion.div>
  );
}