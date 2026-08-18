import { motion, type Variants } from "framer-motion";
import { useEducationData } from "../context/EducationContext";
import { staggerContainer, staggerItem } from "../util/animation";

const moduleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const moduleItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function EducationPage() {
  const { educationState } = useEducationData();

  if (educationState.status === "loading") {
    return (
      <p className="text-neutral-400 text-base">
        Loading education...
      </p>
    );
  }

  if (educationState.status === "error") {
    return (
      <p className="text-red-400 text-base">
        Error: {educationState.error}
      </p>
    );
  }

  const sortedEducation = [...educationState.data].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10"
    >
      {sortedEducation.map((edu) => (
        <motion.div
          key={edu.id}
          variants={staggerItem}
          className="border-l-2 border-neutral-800 pl-6 flex flex-col gap-3"
        >
          <div className="flex justify-between items-baseline flex-wrap gap-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">
                {edu.qualification}
              </h2>

              {edu.fieldOfStudy && (
                <span className="text-xl text-neutral-300 font-normal">
                  in {edu.fieldOfStudy}
                </span>
              )}
            </div>

            <span className="text-sm text-neutral-400 font-mono">
              {edu.startDate?.split("-")[0]} –{" "}
              {edu.current
                ? "Present"
                : edu.endDate?.split("-")[0]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-base flex-wrap">
            <span className="text-blue-400 font-medium">
              {edu.institution}
            </span>

            <span className="text-neutral-600">•</span>

            <span className="text-blue-400 font-medium">
              {edu.location}
            </span>

            {edu.grade && (
              <>
                <span className="text-neutral-600">•</span>

                <span className="text-neutral-300 font-mono text-sm bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded">
                  {edu.grade}
                </span>
              </>
            )}
          </div>

          {edu.description && (
            <p className="text-base text-neutral-300 mt-1 leading-7">
              {edu.description}
            </p>
          )}

          {edu.modules && edu.modules.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                Key Modules
              </h3>

              <motion.div
                variants={moduleContainerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {edu.modules
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((module) => (
                    <motion.div
                      key={module.id}
                      variants={moduleItemVariants}
                      className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <span className="font-medium text-base text-neutral-200">
                          {module.name}
                        </span>

                        {module.grade && (
                          <span className="text-sm text-blue-300 font-mono">
                            {module.grade}
                          </span>
                        )}
                      </div>

                      {module.topics &&
                        module.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {module.topics
                              .sort(
                                (a, b) =>
                                  a.displayOrder -
                                  b.displayOrder
                              )
                              .map((topic) => (
                                <span
                                  key={topic.id}
                                  className="text-xs bg-neutral-800 text-neutral-400 px-2.5 py-1 rounded"
                                >
                                  {topic.title}
                                </span>
                              ))}
                          </div>
                        )}
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}