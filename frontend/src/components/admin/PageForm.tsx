import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  type PageRequest,
  type PageMetadata,
} from "../../api/requestTypes";

import {
  type PageResponse,
  type LayoutTemplateResponse,
} from "../../api/responseTypes";

import {
  fetchLayoutTemplates,
} from "../../api/portfolioApi";

import {
  useAuth,
} from "../../context/AuthContext";

import DynamicMetadataForm from "../shared/DynamicMetadataForm";

import ProjectMediaEditor, {
  type StagedMediaItem,
} from "./ProjectMediaEditor";

interface PageFormProps {
  initialData?: PageResponse;
  onSubmit: (
    data: PageRequest,
    mediaItems: StagedMediaItem[]
  ) => Promise<void>;
  submitButtonText: string;
  isSubmitting?: boolean;
}

function mergeMetadata(
  templateMetadata: Record<string, any> | null | undefined,
  pageMetadata: Record<string, any> | null | undefined
): Record<string, any> {
  return {
    ...(templateMetadata ?? {}),
    ...(pageMetadata ?? {}),
  };
}

export default function PageForm({
  initialData,
  onSubmit,
  submitButtonText,
  isSubmitting = false,
}: PageFormProps) {
  const { token } = useAuth();

  // -----------------------------------------------------------------------
  // Basic page state
  // -----------------------------------------------------------------------

  const [slug, setSlug] = useState(
    initialData?.slug ?? ""
  );

  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [subtitle, setSubtitle] = useState(
    initialData?.subtitle ?? ""
  );

  const [layoutType, setLayoutType] = useState(
    initialData?.layoutType ?? "STANDARD"
  );

  const [content, setContent] = useState(
    initialData?.content ?? ""
  );

  // -----------------------------------------------------------------------
  // Layout template state
  // -----------------------------------------------------------------------

  const [templates, setTemplates] = useState<
    LayoutTemplateResponse[]
  >([]);

  const [template, setTemplate] =
    useState<LayoutTemplateResponse | null>(null);

  const [loadingTemplates, setLoadingTemplates] =
    useState(true);

  const [loadingTemplate, setLoadingTemplate] =
    useState(false);

  const [templateError, setTemplateError] =
    useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Metadata
  // -----------------------------------------------------------------------

  const [metadata, setMetadata] =
    useState<PageMetadata>({});

  // -----------------------------------------------------------------------
  // Media
  // -----------------------------------------------------------------------

  const [mediaItems, setMediaItems] =
    useState<StagedMediaItem[]>(() => {
      return (
        initialData?.media?.map((pageMedia) => ({
          mediaId: pageMedia.media.id,
          originalFilename:
            pageMedia.media.originalFilename,
          contentType:
            pageMedia.media.contentType,
          fileSize:
            pageMedia.media.fileSize,
          displayOrder:
            pageMedia.displayOrder,
          caption:
            pageMedia.caption ?? undefined,
          altText:
            pageMedia.altText ?? undefined,
          viewUrl:
            pageMedia.media.viewUrl,
        })) ?? []
      );
    });

  const [isMediaUploading, setIsMediaUploading] =
    useState(false);

  // -----------------------------------------------------------------------
  // Form errors
  // -----------------------------------------------------------------------

  const [error, setError] =
    useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Load all available layout templates
  //
  // This runs once when the form is mounted. The result is used to populate
  // the Layout select rather than maintaining a hard-coded list of layouts.
  // -----------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      try {
        setLoadingTemplates(true);
        setTemplateError(null);

        const fetchedTemplates =
          await fetchLayoutTemplates();

        if (cancelled) {
          return;
        }

        setTemplates(fetchedTemplates);
      } catch (err) {
        if (!cancelled) {
          setTemplateError(
            err instanceof Error
              ? err.message
              : "Failed to load layout templates."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingTemplates(false);
        }
      }
    }

    loadTemplates();

    return () => {
      cancelled = true;
    };
  }, []);

  // -----------------------------------------------------------------------
  // Load metadata for the currently selected layout
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (layoutType === "MODULAR") {
      setTemplate(null);

      setMetadata(
        initialData?.metadata ?? {}
      );

      return;
    }

    if (loadingTemplates) {
      return;
    }

    setLoadingTemplate(true);
    setTemplateError(null);

    const matchingTemplate =
      templates.find(
        (item) =>
          item.layoutType === layoutType
      ) ?? null;

    setTemplate(matchingTemplate);

    const mergedMetadata =
      mergeMetadata(
        matchingTemplate?.defaultMetadata,
        initialData?.metadata
      );

    setMetadata(mergedMetadata);

    setLoadingTemplate(false);
  }, [
    layoutType,
    templates,
    initialData,
    loadingTemplates,
  ]);

  // -----------------------------------------------------------------------
  // Form submission
  // -----------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError(null);

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      const data: PageRequest = {
        slug: slug.trim(),

        title: title.trim(),

        subtitle:
          subtitle.trim() || null,

        layoutType,

        content:
          content.trim() || null,

        metadata,

        blocks:
          layoutType === "MODULAR"
            ? Array.isArray(metadata.blocks)
              ? metadata.blocks
              : []
            : initialData?.blocks ?? null,
      };

      await onSubmit(
        data,
        mediaItems
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      {error && (
        <div className="rounded-md border border-red-800 bg-red-950/50 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/* Basic page information                                          */}
      {/* --------------------------------------------------------------- */}

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Page Details
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            Basic information used to identify and
            display this page.
          </p>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-300">
            Slug
          </span>

          <input
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
            required
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
          />

          <span className="text-[11px] text-neutral-500">
            Used in the page URL.
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-300">
            Title
          </span>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-300">
            Subtitle
          </span>

          <input
            value={subtitle}
            onChange={(e) =>
              setSubtitle(e.target.value)
            }
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
          />
        </label>

        {/* ------------------------------------------------------------- */}
        {/* Layout                                                        */}
        {/* ------------------------------------------------------------- */}

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-neutral-300">
            Layout
          </span>

          <select
            value={layoutType}
            onChange={(e) =>
              setLayoutType(e.target.value)
            }
            disabled={loadingTemplates}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white disabled:opacity-50"
          >
            {loadingTemplates ? (
              <option value={layoutType}>
                Loading layouts...
              </option>
            ) : (
              <>
                {templates.map((item) => (
                  <option
                    key={item.layoutType}
                    value={item.layoutType}
                  >
                    {item.layoutType}
                  </option>
                ))}

                <option value="MODULAR">
                  MODULAR
                </option>
              </>
            )}
          </select>

          <span className="text-[11px] text-neutral-500">
            The selected layout determines how the
            page is rendered and which metadata fields
            are available.
          </span>

          {templateError && (
            <span className="text-[11px] text-red-400">
              {templateError}
            </span>
          )}
        </label>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Content                                                         */}
      {/* --------------------------------------------------------------- */}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Content
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            Markdown content for layouts that use
            standard page content.
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          rows={8}
          className="resize-y rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 font-mono text-sm text-white"
          placeholder="Write page content using Markdown..."
        />
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Metadata / Modular Blocks                                       */}
      {/* --------------------------------------------------------------- */}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {layoutType === "MODULAR"
              ? "Page Blocks"
              : "Layout Fields"}
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            {layoutType === "MODULAR"
              ? "Build this page using modular content blocks."
              : template
                ? `Fields are provided by the ${layoutType} layout template.`
                : "Fields are provided by the selected layout template."}
          </p>
        </div>

        {loadingTemplates &&
        layoutType !== "MODULAR" ? (
          <div className="rounded-md border border-neutral-800 bg-neutral-900/60 px-4 py-6 text-center text-xs text-neutral-500">
            Loading layout templates...
          </div>
        ) : loadingTemplate &&
          layoutType !== "MODULAR" ? (
          <div className="rounded-md border border-neutral-800 bg-neutral-900/60 px-4 py-6 text-center text-xs text-neutral-500">
            Loading layout fields...
          </div>
        ) : templateError &&
          layoutType !== "MODULAR" ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
            {templateError}
          </div>
        ) : Object.keys(metadata).length ===
          0 ? (
          <div className="rounded-md border border-neutral-800 bg-neutral-900/60 px-4 py-6 text-center text-xs text-neutral-500">
            {layoutType === "MODULAR"
              ? "No blocks have been added yet."
              : "This layout template currently has no fields."}
          </div>
        ) : (
          <DynamicMetadataForm
            data={metadata}
            onChange={setMetadata}
          />
        )}
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Media                                                           */}
      {/* --------------------------------------------------------------- */}

      {token && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Media
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              Attach images, documents, videos or other
              supported media to this page.
            </p>
          </div>

          <ProjectMediaEditor
            mediaItems={mediaItems}
            onChange={setMediaItems}
            token={token}
            onProcessingChange={
              setIsMediaUploading
            }
          />
        </section>
      )}

      {/* --------------------------------------------------------------- */}
      {/* Submit                                                          */}
      {/* --------------------------------------------------------------- */}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          isMediaUploading ||
          loadingTemplates ||
          loadingTemplate
        }
        className="rounded-md bg-blue-500 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
      >
        {isMediaUploading
          ? "Uploading Media…"
          : isSubmitting
            ? "Saving…"
            : submitButtonText}
      </button>
    </form>
  );
}