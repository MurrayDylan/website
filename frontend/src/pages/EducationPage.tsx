import { motion } from "framer-motion";
import { useEducationData } from "../context/EducationContext";
import { staggerContainer, staggerItem } from "../util/animation";

export default function EducationPage() {
  const { educationState } = useEducationData();

  if (educationState.status === "loading") return <p className="text-neutral-400">Loading education...</p>;
  if (educationState.status === "error") return <p className="text-red-400">Error: {educationState.error}</p>;

  // Ensure education entries respect the custom backend sorting order
  const sortedEducation = [...educationState.data].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      {sortedEducation.map((edu) => (
        <motion.div
          key={edu.id}
          variants={staggerItem}
          className="border-l-2 border-neutral-800 pl-4 flex flex-col gap-2"
        >
          
          {/* Top Row: Qualification + Field & Dates */}
          <div className="flex justify-between items-baseline flex-wrap gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white">{edu.qualification}</h2>
              {edu.fieldOfStudy && (
                <span className="text-lg text-neutral-300 font-normal">
                  in {edu.fieldOfStudy}
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {edu.startDate?.split("-")[0]} – {edu.current ? "Present" : edu.endDate?.split("-")[0]}
            </span>
          </div>

          {/* Sub Row: Institution & Grade */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-blue-400 font-medium">{edu.institution}</span>
            <span className="text-neutral-600">•</span>
            <span className="text-blue-400 font-medium">{edu.location}</span>
            {edu.grade && (
              <>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-300 font-mono text-xs bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                  {edu.grade}
                </span>
              </>
            )}
          </div>

          {edu.description && <p className="text-sm text-neutral-300 mt-1">{edu.description}</p>}

          {edu.modules && edu.modules.length > 0 && (
            <div className="mt-4 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Key Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {edu.modules
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((module) => (
                    <div key={module.id} className="bg-neutral-900/60 p-3 rounded-lg border border-neutral-800 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-neutral-200">{module.name}</span>
                        {module.grade && <span className="text-xs text-blue-300 font-mono">{module.grade}</span>}
                      </div>

                      {module.topics && module.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {module.topics
                            .sort((a, b) => a.displayOrder - b.displayOrder)
                            .map((topic) => (
                              <span key={topic.id} className="text-[11px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                                {topic.title}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}