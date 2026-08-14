import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";

interface GalleryImage {
  id: number | string;
  viewUrl: string;
  downloadUrl?: string;
  altText?: string;
  caption?: string;
}

interface ChartCarouselProps {
  images: GalleryImage[];
  className?: string;
}

const DOT_WINDOW_SIZE = 10;
const PIVOT_SLOT = 8;
const MAX_LIST_PANEL_HEIGHT = 320;

export default function ChartCarousel({
  images,
  className = "",
}: ChartCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);

  /*
   * Keep Embla's selected slide in React state.
   */
  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  /*
   * Embla navigation.
   */
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  /*
   * Generate the visible dot window.
   *
   * For small galleries all images get a dot.
   *
   * For larger galleries we display a maximum of ten dots and move
   * the window as the user moves through the carousel.
   */
  const dotSlots = useMemo(() => {
    const total = images.length;

    let windowStart = 0;
    let windowSize = total;

    if (total > DOT_WINDOW_SIZE) {
      windowSize = DOT_WINDOW_SIZE;

      const maxStart = total - DOT_WINDOW_SIZE;

      windowStart = Math.min(
        Math.max(selectedIndex - PIVOT_SLOT, 0),
        maxStart
      );
    }

    const windowEnd = windowStart + windowSize - 1;

    const leadingSmall = windowStart > 0;
    const trailingSmall = windowEnd < total - 1;

    return Array.from({ length: windowSize }, (_, slot) => {
      const imageIndex = windowStart + slot;

      const isSmall =
        (slot === 0 && leadingSmall) ||
        (slot === windowSize - 1 && trailingSmall);

      return {
        imageIndex,
        isSmall,
        isCurrent: imageIndex === selectedIndex,
      };
    });
  }, [images.length, selectedIndex]);

  if (images.length === 0) {
    return null;
  }

  /*
   * Single image.
   *
   * No Embla controls are necessary.
   *
   * The same responsive containment behaviour is used here so that
   * unusual aspect ratios do not distort the page.
   */
  if (images.length === 1) {
    const only = images[0];
    const label = only.caption;

    return (
      <figure
        className={`overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950 ${className}`}
      >
        <div className="relative flex aspect-video max-h-[600px] w-full items-center justify-center overflow-hidden">
          <img
            src={only.viewUrl}
            alt={only.altText || label || "Image"}
            className="block h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {(label || only.downloadUrl) && (
          <figcaption className="flex items-center justify-between gap-3 border-t border-neutral-700/50 bg-neutral-900/40 px-3 py-2 text-xs text-neutral-400">
            <span className="min-w-0 truncate">
              {label}
            </span>

            {only.downloadUrl && (
              <a
                href={only.downloadUrl}
                download
                className="ml-2 shrink-0 text-blue-400 transition hover:text-blue-300"
              >
                Download
              </a>
            )}
          </figcaption>
        )}
      </figure>
    );
  }

  const total = images.length;
  const active = images[selectedIndex];

  const activeLabel =
    active.caption || `Chart ${selectedIndex + 1}`;

  return (
    <div
      className={`overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950 ${className}`}
    >
      {/* =========================================================
          IMAGE VIEWPORT
          ========================================================= */}

      <div
        ref={emblaRef}
        className="aspect-video max-h-[600px] w-full overflow-hidden"
      >
        <div className="flex h-full">
          {images.map((img) => (
            <div
              key={img.id}
              className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center"
            >
              {/*
               * The image itself never determines the carousel size.
               *
               * h-full + w-full + object-contain means:
               *
               * - wide image -> empty space above/below
               * - tall image -> empty space left/right
               * - normal image -> fills the viewport appropriately
               *
               * The aspect ratio is always preserved.
               */}
              <img
                src={img.viewUrl}
                alt={
                  img.altText ||
                  img.caption ||
                  "Chart"
                }
                className="block h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          CAPTION / DOWNLOAD
          ========================================================= */}

      <div className="flex items-center justify-between gap-3 border-t border-neutral-700/50 bg-neutral-900/40 px-3 py-2 text-xs text-neutral-400">
        <span className="min-w-0 truncate">
          {activeLabel}
        </span>

        {active.downloadUrl && (
          <a
            href={active.downloadUrl}
            download
            className="ml-2 shrink-0 text-blue-400 transition hover:text-blue-300"
          >
            Download
          </a>
        )}
      </div>

      {/* =========================================================
          NAVIGATION
          ========================================================= */}

      <div className="relative flex items-center border-t border-neutral-700/50 bg-neutral-900/40 px-3 py-2">
        {/* -------------------------------------------------------
            PREVIOUS
            ------------------------------------------------------- */}

        <button
          type="button"
          onClick={scrollPrev}
          disabled={selectedIndex === 0}
          aria-label="Previous image"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-700 text-neutral-400 transition hover:border-neutral-500 hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:border-neutral-700 disabled:hover:text-neutral-400"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* -------------------------------------------------------
            DOTS

            Absolutely centred so the number of dots does not
            affect their horizontal position.
            ------------------------------------------------------- */}

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {dotSlots.map(
            ({
              imageIndex,
              isSmall,
              isCurrent,
            }) => (
              <button
                key={imageIndex}
                type="button"
                onClick={() => scrollTo(imageIndex)}
                aria-label={`Go to image ${
                  imageIndex + 1
                }`}
                aria-current={
                  isCurrent ? "true" : undefined
                }
                className={[
                  "rounded-full transition-all",
                  isCurrent
                    ? "bg-blue-400"
                    : "bg-neutral-600 hover:bg-neutral-500",
                  isSmall
                    ? "h-1.5 w-1.5"
                    : "h-2 w-2",
                ].join(" ")}
              />
            )
          )}
        </div>

        {/* -------------------------------------------------------
            NEXT + FILE EXPLORER

            Both stay on the right.
            ------------------------------------------------------- */}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={scrollNext}
            disabled={selectedIndex === total - 1}
            aria-label="Next image"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-700 text-neutral-400 transition hover:border-neutral-500 hover:text-white disabled:cursor-default disabled:opacity-30 disabled:hover:border-neutral-700 disabled:hover:text-neutral-400"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() =>
              setIsListOpen((previous) => !previous)
            }
            aria-label={
              isListOpen
                ? "Hide all images"
                : "Show all images"
            }
            aria-expanded={isListOpen}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-neutral-700 text-neutral-400 transition hover:border-neutral-500 hover:text-white"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* =========================================================
          FILE EXPLORER
          ========================================================= */}

      <AnimatePresence initial={false}>
        {isListOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="overflow-hidden border-t border-neutral-700/50"
          >
            <div
              className="overflow-y-auto p-2"
              style={{
                maxHeight: `${MAX_LIST_PANEL_HEIGHT}px`,
              }}
            >
              <div className="flex flex-col gap-1">
                {images.map((img, index) => {
                  const label =
                    img.caption ||
                    `Chart ${index + 1}`;

                  const isCurrent =
                    index === selectedIndex;

                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        scrollTo(index);
                        setIsListOpen(false);
                      }}
                      className={[
                        "flex items-center gap-2 rounded-md p-1.5 text-left transition",
                        isCurrent
                          ? "bg-blue-500/15"
                          : "hover:bg-neutral-800",
                      ].join(" ")}
                    >
                      <img
                        src={img.viewUrl}
                        alt={label}
                        className="h-10 w-14 shrink-0 rounded border border-neutral-700 object-cover"
                        loading="lazy"
                      />

                      <span
                        className={[
                          "min-w-0 truncate text-xs",
                          isCurrent
                            ? "text-blue-300"
                            : "text-neutral-300",
                        ].join(" ")}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}