import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import {
  type PageResponse,
  type WorkExperienceResponse,
  type ProjectResponse,
  type EducationResponse,
  type TechnologyResponse,
  type SiteSettingsResponse,
} from "../../api/responseTypes";
import {
  fetchSiteSettings,
  fetchWorkExperience,
  fetchProjects,
  getEducation,
  fetchTechnologies,
  getCvDownloadUrl,
  createCvMediaItem,
} from "../../api/portfolioApi";
import MediaViewer from "../shared/MediaViewer";
import Avatar from "../media/Avatar";
import { DiGithubBadge } from "react-icons/di";
import { AiFillLinkedin } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { staggerContainer, staggerItem } from "../../util/animation";

interface AboutStat {
  label: string;
  value: string;
  detail: string;
}

interface ExtraWorkInfo {
  workImpact: string;
  shortHandDescription: string;
}

function extractShorthandDescription(description: string): { shorthand: string | null; cleanDescription: string } {
  const match = description.match(/<!--\s*short:\s*([\s\S]*?)\s*-->/);

  if (match) {
    const shorthand = match[1].trim();
    const cleanDescription = description.replace(/<!--\s*short:[\s\S]*?-->/, "").trim();
    return { shorthand, cleanDescription };
  }

  return { shorthand: null, cleanDescription: description };
}

export default function AboutLayout({ page }: { page: PageResponse }) {
  const name = (page.metadata?.name as string) || "Dylan Murray";
  const location = (page.metadata?.location as string) || "Dublin, Ireland";
  const status =
    (page.metadata?.status as string) === "Unemployed"
      ? "Open to Software Engineering Opportunities"
      : (page.metadata?.status as string) || "";
  const stats: AboutStat[] = (page.metadata?.stats as AboutStat[]) ?? [];

  const extraWorkInfo: Record<string, ExtraWorkInfo> =
    (page.metadata?.extraWorkInfo as Record<string, ExtraWorkInfo>) ?? {};

  const avatar = page.media?.[0];
  const additionalMedia = page.media?.slice(1) ?? [];
  const pageMediaItems = additionalMedia.map((item) => ({
    id: item.id,
    media: item.media,
    caption: item.caption ?? undefined,
    altText: item.altText ?? undefined,
  }));
  const allMediaItems = [createCvMediaItem("Curriculum Vitae"), ...pageMediaItems];

  const [settings, setSettings] = useState<SiteSettingsResponse | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperienceResponse[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectResponse[]>([]);
  const [education, setEducation] = useState<EducationResponse[]>([]);
  const [techByCategory, setTechByCategory] = useState<Record<string, TechnologyResponse[]>>({});

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      fetchSiteSettings(),
      fetchWorkExperience(),
      fetchProjects(),
      getEducation(),
      fetchTechnologies(),
    ]).then(([settingsRes, workRes, projectsRes, educationRes, techRes]) => {
      if (cancelled) return;

      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value);
      else console.error("Failed to load site settings", settingsRes.reason);

      if (workRes.status === "fulfilled") setWorkExperience(workRes.value);
      else console.error("Failed to load work experience", workRes.reason);

      if (projectsRes.status === "fulfilled") {
        const sorted = [...projectsRes.value].sort(
          (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
        );
        setFeaturedProjects(sorted.slice(0, 3));
      } else {
        console.error("Failed to load projects", projectsRes.reason);
      }

      if (educationRes.status === "fulfilled") setEducation(educationRes.value);
      else console.error("Failed to load education", educationRes.reason);

      if (techRes.status === "fulfilled") {
        const grouped: Record<string, TechnologyResponse[]> = {};
        for (const tech of techRes.value) {
          const category = tech.category || "Other";
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(tech);
        }
        setTechByCategory(grouped);
      } else {
        console.error("Failed to load technologies", techRes.reason);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col flex-1 max-w-4xl mx-auto w-full py-6 px-4 space-y-12 text-neutral-200"
    >
      <motion.div
        variants={staggerItem}
        className="flex flex-col sm:flex-row gap-6 items-center sm:items-start pb-8 border-b border-neutral-800 text-center sm:text-left"
      >
        {avatar && <Avatar media={avatar.media} altText={avatar.altText ?? undefined} />}

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{name}</h1>
            <p className="text-lg text-blue-400 font-medium mt-1">
              Computer Science Graduate & Software Engineer
            </p>
            <p className="text-sm text-neutral-400 mt-0.5">
              Trinity College Dublin · Distinction · {location}
            </p>
          </div>

          {status && (
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 pt-1">
              <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full font-medium">
                {status}
              </span>
            </div>
          )}

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 pt-2">
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded-md transition"
                title="Send Email"
              >
                <CiMail size={16} />
                Email
              </a>
            )}

            {settings?.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded-md transition"
              >
                <AiFillLinkedin size={16} />
                LinkedIn
              </a>
            )}

            {settings?.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-2 rounded-md transition"
              >
                <DiGithubBadge size={16} />
                GitHub
              </a>
            )}

            <a
              href={getCvDownloadUrl()}
              download
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-2 rounded-md transition shadow-sm"
            >
              <HiOutlineDocumentDownload size={16} />
              Download CV
            </a>
          </div>
        </div>
      </motion.div>

      {stats.length > 0 && (
        <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-lg flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              <span className="text-xl sm:text-2xl font-bold text-blue-400">{stat.value}</span>
              <span className="text-sm font-semibold text-white mt-0.5">{stat.label}</span>
              <span className="text-xs text-neutral-400 mt-1">{stat.detail}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* About */}
      <motion.section variants={staggerItem} className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">About</h2>
        {page.content && (
          <div className="text-base text-neutral-300 leading-relaxed bg-neutral-900/40 p-5 rounded-lg border border-neutral-800/60">
            <ReactMarkdown>{page.content}</ReactMarkdown>
          </div>
        )}
      </motion.section>

      {workExperience.length > 0 && (
        <motion.section variants={staggerItem} className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp) => {
              const workInfo = extraWorkInfo[String(exp.id)];
              return (
                <div
                  key={exp.id}
                  className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-lg space-y-3 hover:border-neutral-700 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-base font-bold text-white">{exp.companyName}</h3>
                      <p className="text-xs text-blue-400 font-medium">{exp.jobTitle}</p>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>

                  {workInfo && (
                    <div className="space-y-2">
                      <p className="text-xs text-neutral-400 font-medium">
                        {workInfo.shortHandDescription}
                      </p>

                      <div className="text-xs bg-blue-950/30 border border-blue-800/40 text-blue-200 px-3 py-2 rounded-md font-medium">
                        Impact: {workInfo.workImpact}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech.id}
                        className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-0.5 rounded"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}


      {featuredProjects.length > 0 && (
        <motion.section variants={staggerItem} className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Selected Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProjects.map((proj) => {
              const { shorthand, cleanDescription } = extractShorthandDescription(proj.description || "");
              const displayText = shorthand || cleanDescription;

              return (
                <div
                  key={proj.id}
                  className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-lg flex flex-col justify-between space-y-3 hover:border-neutral-700 transition"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">{displayText}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-neutral-800/80">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech.id}
                        className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {Object.keys(techByCategory).length > 0 && (
        <motion.section variants={staggerItem} className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Technical Toolkit
          </h2>
          <div className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-lg space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(techByCategory).map(([category, techs]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-neutral-400 mb-2">{category}</h3>
                  <p className="text-xs text-neutral-200 leading-normal">
                    {techs.map((t) => t.name).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {education.length > 0 && (
        <motion.section variants={staggerItem} className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{edu.institution}</h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      {edu.qualification}
                      {edu.fieldOfStudy ? ` · ${edu.fieldOfStudy}` : ""}
                    </p>
                    {edu.description && (
                      <p className="text-xs text-neutral-400 mt-1">{edu.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="text-xs text-neutral-400 font-mono">
                      {edu.startDate.split("-")[0]} – {edu.current ? "Present" : edu.endDate?.split("-")[0]}
                    </span>
                    {edu.grade && (
                      <span className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded font-medium">
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {allMediaItems.length > 0 && (
        <motion.section variants={staggerItem} className="pt-4 border-t border-neutral-800">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Complete Curriculum Vitae & Attachments
          </h2>
          <MediaViewer items={allMediaItems} />
        </motion.section>
      )}
    </motion.article>
  );
}