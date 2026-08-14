import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

import { staggerContainer, staggerItem } from "../../util/animation";

import ArchitectureFlow from "../shared/ArchitectureFlow";
import ArchitectureGroup from "../shared/ArchitectureGroup";
import ContentTabs from "../shared/ContentTab";
import DecisionCard from "../shared/DecisionCard";
import FeatureCard from "../shared/FeatureCard";

import {
  type PageResponse,
} from "../../api/responseTypes";

// ai made with placeholder text for the moment 

export interface AboutMetadata {
  overview: {
    title: string;
    description: string;
  };

  summary: Array<{
    value: string;
    label: string;
    description: string;
  }>;

  architecture: {
    title: string;
    description: string;

    flow: Array<{
      id: string;
      title: string;
      subtitle: string;
      description: string;
      technologies?: string[];
      variant?: "primary" | "database";
    }>;

    groups: Array<{
      title: string;
      description: string;
      nodes: Array<{
        title: string;
        subtitle: string;
        description: string;
      }>;
    }>;

    media: {
      title: string;
      description: string;

      flow: Array<{
        id: string;
        title: string;
        subtitle: string;
        description: string;
      }>;

      notes: Array<{
        title: string;
        description: string;
      }>;
    };
  };

  technology: {
    title: string;
    description: string;

    tabs: Array<{
      id: string;
      label: string;
      heading: string;
      description: string;

      details: Array<{
        title: string;
        description: string;
      }>;
    }>;

    stack: string[];
  };

  decisions: {
    title: string;
    description: string;

    items: Array<{
      title: string;
      problem: string;
      decision: string;
      reason: string;
    }>;
  };

  features: {
    title: string;
    description: string;

    items: Array<{
      title: string;
      tag: string;
      description: string;
      tech: string[];
    }>;
  };

  evolution: {
    title: string;
    description: string;

    items: Array<{
      title: string;
      tag: string;
      description: string;
    }>;
  };

  closing: {
    title: string;
    paragraphs: string[];
  };
}

const EMPTY_METADATA: AboutMetadata = {
  overview: {
    title: "A portfolio that became a full-stack application",
    description:
      "The important part of the project is what sits behind the pages.",
  },

  summary: [],

  architecture: {
    title: "Architecture",
    description:
      "A high-level view of how a request moves through the application.",
    flow: [],
    groups: [],
    media: {
      title: "Media upload path",
      description:
        "Media deliberately has its own path because file storage is a different concern from ordinary relational persistence.",
      flow: [],
      notes: [],
    },
  },

  technology: {
    title: "Technology",
    description:
      "The stack is less important than the responsibilities assigned to each part of it.",
    tabs: [],
    stack: [],
  },

  decisions: {
    title: "Engineering decisions",
    description:
      "The architecture is a collection of decisions made in response to problems that appeared during development.",
    items: [],
  },

  features: {
    title: "What the application actually does",
    description:
      "The features below are where the architectural decisions become visible in the finished system.",
    items: [],
  },

  evolution: {
    title: "How the project evolved",
    description:
      "The final architecture was not designed all at once. Each stage introduced problems that changed what the application needed to be.",
    items: [],
  },

  closing: {
    title: "Why this project matters",
    paragraphs: [],
  },
};

function getMetadata(
  metadata: Record<string, any> | null | undefined
): AboutMetadata {
  if (!metadata) {
    return EMPTY_METADATA;
  }

  return {
    ...EMPTY_METADATA,
    ...metadata,

    overview: {
      ...EMPTY_METADATA.overview,
      ...(metadata.overview ?? {}),
    },

    architecture: {
      ...EMPTY_METADATA.architecture,
      ...(metadata.architecture ?? {}),
      media: {
        ...EMPTY_METADATA.architecture.media,
        ...(metadata.architecture?.media ?? {}),
      },
    },

    technology: {
      ...EMPTY_METADATA.technology,
      ...(metadata.technology ?? {}),
    },

    decisions: {
      ...EMPTY_METADATA.decisions,
      ...(metadata.decisions ?? {}),
    },

    features: {
      ...EMPTY_METADATA.features,
      ...(metadata.features ?? {}),
    },

    evolution: {
      ...EMPTY_METADATA.evolution,
      ...(metadata.evolution ?? {}),
    },

    closing: {
      ...EMPTY_METADATA.closing,
      ...(metadata.closing ?? {}),
    },
  };
}

interface AboutThisWebsiteLayoutProps {
  page?: PageResponse;
}

export default function AboutThisWebsiteLayout({
  page,
}: AboutThisWebsiteLayoutProps) {
  console.log("🔥 ABOUT THIS WEBSITE LAYOUT RENDERED");
  console.log("PAGE:", page);
  console.log("METADATA:", page?.metadata);

  const metadata = getMetadata(page?.metadata);

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={[
        "mx-auto flex w-full max-w-5xl flex-col",
        "gap-9 px-3.5 py-4",
        "sm:gap-12 sm:px-5 sm:py-7",
        "md:gap-14 md:px-6 md:py-10",
      ].join(" ")}
    >

      <motion.header variants={staggerItem}>
        <div className="border-b border-neutral-800 pb-6 sm:pb-8">
          <p className="text-[9px] font-mono uppercase tracking-[0.12em] text-blue-400 sm:text-xs">
            Capstone / Engineering Case Study
          </p>

          <h1 className="mt-2.5 text-[22px] font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
            {page?.title || "About This Website"}
          </h1>

          <p className="mt-3 max-w-3xl text-[11px] leading-6 text-neutral-400 sm:mt-4 sm:text-sm sm:leading-7 md:text-base">
            {page?.subtitle}
          </p>
        </div>

        {metadata.summary.length > 0 && (
          <div className="grid grid-cols-1 border-b border-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
            {metadata.summary.map((item) => (
              <SummaryItem
                key={`${item.label}-${item.value}`}
                value={item.value}
                label={item.label}
                description={item.description}
              />
            ))}
          </div>
        )}
      </motion.header>

      <motion.section
        variants={staggerItem}
        className="min-w-0"
      >
        <SectionTitle
          title={metadata.overview.title}
          description={metadata.overview.description}
        />

        {page?.content ? (
          <div className="prose prose-invert prose-sm max-w-3xl prose-p:leading-6 prose-p:text-neutral-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400 sm:prose-p:leading-7">
            <ReactMarkdown>
              {page.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-sm text-neutral-500">
            No overview content has been configured.
          </div>
        )}
      </motion.section>

      <motion.section
        variants={staggerItem}
        className="min-w-0"
      >
        <SectionTitle
          title={metadata.architecture.title}
          description={metadata.architecture.description}
        />

        {metadata.architecture.flow.length > 0 && (
          <ArchitectureFlow
            items={metadata.architecture.flow}
            direction="vertical"
          />
        )}

        {metadata.architecture.groups.length > 0 && (
          <div className="mt-5 grid min-w-0 grid-cols-1 gap-4">
            {metadata.architecture.groups.map((group) => (
              <ArchitectureGroup
                key={group.title}
                title={group.title}
                description={group.description}
                nodes={group.nodes}
              />
            ))}
          </div>
        )}

        {metadata.architecture.media.flow.length > 0 && (
          <div className="mt-5 min-w-0 rounded-lg border border-neutral-800 bg-neutral-900/20 p-4 max-sm:border-neutral-700 sm:p-5">
            <div>
              <h3 className="text-[13px] font-semibold text-white sm:text-sm">
                {metadata.architecture.media.title}
              </h3>

              <p className="mt-1 text-[11px] leading-5 text-neutral-500 sm:text-xs sm:leading-6">
                {metadata.architecture.media.description}
              </p>
            </div>

            <div className="mt-4 sm:mt-5">
              <ArchitectureFlow
                items={metadata.architecture.media.flow}
                direction="vertical"
              />
            </div>

            {metadata.architecture.media.notes.length > 0 && (
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-neutral-800 pt-4 max-sm:border-neutral-700 sm:mt-5 sm:grid-cols-2 sm:gap-5 sm:pt-5 lg:grid-cols-3">
                {metadata.architecture.media.notes.map(
                  (note) => (
                    <ArchitectureNote
                      key={note.title}
                      title={note.title}
                      description={note.description}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}
      </motion.section>

      <motion.section
        variants={staggerItem}
        className="min-w-0"
      >
        <SectionTitle
          title={metadata.technology.title}
          description={metadata.technology.description}
        />

        {metadata.technology.tabs.length > 0 && (
          <ContentTabs
            tabs={metadata.technology.tabs.map((tab) => ({
              id: tab.id,
              label: tab.label,
              content: (
                <TechnologyTabContent
                  heading={tab.heading}
                  description={tab.description}
                  details={tab.details}
                />
              ),
            }))}
            defaultTab={
              metadata.technology.tabs[0]?.id
            }
          />
        )}

        {metadata.technology.stack.length > 0 && (
          <div className="mt-4 flex min-w-0 flex-wrap gap-x-3 gap-y-1.5 border-t border-neutral-800 pt-4 max-sm:border-neutral-700 sm:mt-5 sm:gap-x-4 sm:gap-y-2 sm:pt-5">
            {metadata.technology.stack.map(
              (technology) => (
                <span
                  key={technology}
                  className="text-[9px] font-mono text-neutral-500 sm:text-xs"
                >
                  {technology}
                </span>
              )
            )}
          </div>
        )}
      </motion.section>

      <motion.section
        variants={staggerItem}
        className="min-w-0"
      >
        <SectionTitle
          title={metadata.decisions.title}
          description={metadata.decisions.description}
        />

        <div className="grid min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-2 lg:gap-4">
          {metadata.decisions.items.map(
            (decision) => (
              <DecisionCard
                key={decision.title}
                title={decision.title}
                problem={decision.problem}
                decision={decision.decision}
                reason={decision.reason}
              />
            )
          )}
        </div>
      </motion.section>

      <motion.section
        variants={staggerItem}
        className="min-w-0"
      >
        <SectionTitle
          title={metadata.features.title}
          description={metadata.features.description}
        />

        <div className="grid min-w-0 grid-cols-1 gap-3.5 lg:grid-cols-2 lg:gap-4">
          {metadata.features.items.map(
            (feature) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                tag={feature.tag}
                description={feature.description}
                tech={feature.tech}
              />
            )
          )}
        </div>
      </motion.section>

      <motion.section
        variants={staggerItem}
        className="min-w-0"
      >
        <SectionTitle
          title={metadata.evolution.title}
          description={metadata.evolution.description}
        />

        <div className="border-y border-neutral-800 max-sm:border-neutral-700">
          {metadata.evolution.items.map(
            (item, index) => (
              <div
                key={item.title}
                className={[
                  "grid grid-cols-[25px_1fr] gap-3",
                  "border-b border-neutral-800 py-5 last:border-b-0",
                  "max-sm:border-neutral-700",
                  "sm:grid-cols-[34px_1fr] sm:gap-4 sm:py-6",
                  "lg:grid-cols-[40px_120px_1fr] lg:gap-6",
                ].join(" ")}
              >
                <span className="pt-0.5 text-[9px] font-mono text-neutral-600 sm:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="hidden lg:block">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                    {item.tag}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="lg:hidden">
                    <span className="text-[9px] uppercase tracking-[0.12em] text-neutral-500">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-1 text-[13px] font-semibold leading-6 text-white lg:mt-0 sm:text-sm">
                    {item.title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-[11px] leading-5 text-neutral-400 sm:text-sm sm:leading-7">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </motion.section>

      <motion.section
        variants={staggerItem}
        className="border-t border-neutral-800 pt-7 max-sm:border-neutral-700 sm:pt-8"
      >
        <div className="max-w-3xl">
          <h2 className="text-base font-semibold text-white sm:text-lg">
            {metadata.closing.title}
          </h2>

          {metadata.closing.paragraphs.map(
            (paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-[11px] leading-6 text-neutral-400 sm:text-sm sm:leading-7"
              >
                {paragraph}
              </p>
            )
          )}
        </div>
      </motion.section>
    </motion.article>
  );
}


function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-[11px] leading-5 text-neutral-400 sm:text-sm sm:leading-6">
        {description}
      </p>
    </div>
  );
}

function SummaryItem({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div
      className={[
        "border-b border-neutral-800",
        "px-0 py-4",
        "last:border-b-0",
        "max-sm:border-neutral-700",
        "sm:px-4 sm:py-5",
        "sm:[&:nth-child(odd)]:border-r",
        "lg:border-b-0 lg:border-r lg:px-5",
        "lg:first:pl-0",
        "lg:last:border-r-0",
      ].join(" ")}
    >
      <p className="text-[13px] font-semibold text-white sm:text-sm">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-wide text-neutral-500 sm:text-[10px]">
        {label}
      </p>

      <p className="mt-1.5 text-[10px] text-neutral-600 sm:mt-2 sm:text-xs">
        {description}
      </p>
    </div>
  );
}

function TechnologyTabContent({
  heading,
  description,
  details,
}: {
  heading: string;
  description: string;
  details: Array<{
    title: string;
    description: string;
  }>;
}) {
  return (
    <div className="min-w-0 space-y-5">
      <div>
        <h3 className="text-base font-semibold text-white sm:text-lg">
          {heading}
        </h3>

        <p className="mt-2 max-w-2xl text-[11px] leading-6 text-neutral-400 sm:text-sm sm:leading-7">
          {description}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((detail) => (
          <TechnologyDetail
            key={detail.title}
            title={detail.title}
            description={detail.description}
          />
        ))}
      </div>
    </div>
  );
}

function TechnologyDetail({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-w-0 border-t border-neutral-800 pt-3.5 max-sm:border-neutral-700 sm:pt-4">
      <h4 className="text-[11px] font-semibold text-white sm:text-xs">
        {title}
      </h4>

      <p className="mt-1.5 text-[10px] leading-5 text-neutral-500 sm:text-xs sm:leading-6">
        {description}
      </p>
    </div>
  );
}

function ArchitectureNote({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-w-0">
      <h4 className="text-[11px] font-medium text-neutral-300 sm:text-xs">
        {title}
      </h4>

      <p className="mt-1 text-[10px] leading-5 text-neutral-500 sm:text-xs sm:leading-6">
        {description}
      </p>
    </div>
  );
}