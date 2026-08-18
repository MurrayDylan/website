import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useTitleOverride,
} from "../../context/TitleContext";

import {
  createPage,
  attachMediaToPage,
} from "../../api/portfolioApi";

import {
  type PageRequest,
} from "../../api/requestTypes";

import {
  type LayoutType,
} from "../../api/responseTypes";

import PageForm from "../../components/admin/PageForm";

import {
  type StagedMediaItem,
} from "../../components/admin/ProjectMediaEditor";

export default function CreatePagePage() {
  const { token } = useAuth();

  const navigate = useNavigate();

  const {
    setTitleOverride,
    setHeaderAction,
  } = useTitleOverride();

  const [searchParams] =
    useSearchParams();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const initialSlug =
    searchParams.get("slug") ?? "";

  const initialLayout =
    (searchParams.get(
      "layout"
    ) as LayoutType) ?? "MODULAR";

  const initialTitle =
    searchParams.get("title") ?? "";

  useEffect(() => {
    setTitleOverride("Create Page");

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

  async function handleSubmit(
    data: PageRequest,
    mediaItems: StagedMediaItem[]
  ) {
    if (!token) {
      throw new Error(
        "You must be logged in to create a page."
      );
    }

    try {
      setIsSubmitting(true);

      const createdPage =
        await createPage(
          data,
          token
        );

      for (const item of mediaItems) {
        await attachMediaToPage(
          createdPage.slug,
          item.mediaId,
          {
            displayOrder:
              Number(item.displayOrder) || 0,
            caption:
              item.caption ?? undefined,
            altText:
              item.altText ?? undefined,
            isHorizontal:
              item.isHorizontal ?? false,
          },
          token
        );
      }

      navigate("/admin");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageForm
        initialData={{
          id: 0,
          slug: initialSlug,
          title: initialTitle,
          subtitle: null,
          layoutType: initialLayout,
          content: null,
          metadata: {},
          blocks: [],
          media: [],
          updatedAt: new Date().toISOString(),
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Create Page"
      />
    </div>
  );
}