import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useTitleOverride,
} from "../../context/TitleContext";

import {
  fetchPageBySlug,
  updatePage,
  attachMediaToPage,
  updatePageMedia,
  removeMediaFromPage,
} from "../../api/portfolioApi";

import {
  type PageResponse,
} from "../../api/responseTypes";

import {
  type PageRequest,
} from "../../api/requestTypes";

import PageForm from "../../components/admin/PageForm";

import {
  type StagedMediaItem,
} from "../../components/admin/ProjectMediaEditor";

export default function EditPagePage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const { token } = useAuth();

  const navigate = useNavigate();

  const {
    setTitleOverride,
    setHeaderAction,
  } = useTitleOverride();

  const [page, setPage] =
    useState<PageResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    setTitleOverride("Edit Page");

    setHeaderAction(
      <button
        onClick={() => navigate("/admin")}
        className="text-sm text-neutral-400 hover:text-white"
      >
        Close
      </button>
    );

    return () => {
      setHeaderAction(null);
    };
  }, [
    navigate,
    setHeaderAction,
    setTitleOverride,
  ]);

  useEffect(() => {
    if (!slug) {
      setError("No page slug was provided.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPage(
      pageSlug: string
    ) {
      try {
        setLoading(true);
        setError(null);

        const result =
          await fetchPageBySlug(pageSlug);

        if (!cancelled) {
          setPage(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load page."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage(slug);

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(
    data: PageRequest,
    mediaItems: StagedMediaItem[]
  ) {
    if (!token) {
      throw new Error(
        "You must be logged in to edit a page."
      );
    }

    if (!slug) {
      throw new Error(
        "Page slug is missing."
      );
    }

    try {
      setIsSubmitting(true);

      await updatePage(
        slug,
        data,
        token
      );

      /*
       * Media synchronisation
       *
       * Existing page media are identified by media ID.
       * New media are attached.
       * Existing media have their attachment metadata updated.
       * Removed media are detached.
       */

      const existingMedia =
        page?.media ?? [];

      const submittedMediaIds =
        new Set(
          mediaItems.map(
            (item) => item.mediaId
          )
        );

      // Remove media that no longer exists
      // in the editor.
      for (const existing of existingMedia) {
        if (
          !submittedMediaIds.has(
            existing.media.id
          )
        ) {
          await removeMediaFromPage(
            slug,
            existing.media.id,
            token
          );
        }
      }

      // Attach/update submitted media.
      for (const item of mediaItems) {
        const existing =
          existingMedia.find(
            (media) =>
              media.media.id ===
              item.mediaId
          );

        const payload = {
          displayOrder:
            Number(item.displayOrder) || 0,
          caption:
            item.caption ?? undefined,
          altText:
            item.altText ?? undefined,
        };

        if (existing) {
          await updatePageMedia(
            slug,
            item.mediaId,
            payload,
            token
          );
        } else {
          await attachMediaToPage(
            slug,
            item.mediaId,
            payload,
            token
          );
        }
      }

      navigate("/admin");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-sm text-neutral-500">
          Loading page...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
        {error}
      </div>
    );
  }

  if (!page) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-6 text-center text-sm text-neutral-500">
        Page not found.
      </div>
    );
  }

  return (
    <div>
      <PageForm
        initialData={page}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Save Page"
      />
    </div>
  );
}