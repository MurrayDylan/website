import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import {
  createWorkExperience,
  attachMediaToWork,
} from "../../api/portfolioApi";
import WorkForm from "../../components/admin/WorkForm";
import { type WorkExperienceRequest } from "../../api/requestTypes"
import { type StagedMediaItem } from "../../components/admin/ProjectMediaEditor";

export default function CreateWorkPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  useEffect(() => {
    setTitleOverride(null);
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <button
          onClick={() => navigate("/admin/work")}
          className="text-sm text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>
    );

    return () => setHeaderAction(null);
  }, [navigate, setHeaderAction, setTitleOverride]);

  async function handleSubmit(
    data: WorkExperienceRequest,
    mediaItems: StagedMediaItem[]
  ) {
    if (!token) return;

    // 1. Create base work experience entry
    const work = await createWorkExperience(data, token);

    // 2. Attach media items from staged basket
    for (const item of mediaItems) {
      if (!item.mediaId) continue;

      try {
        await attachMediaToWork(
          work.id,
          item.mediaId,
          {
            displayOrder: Number(item.displayOrder) || 0,
            caption: item.caption ?? undefined,
            altText: item.altText ?? undefined,
          },
          token
        );
      } catch (err) {
        // Silently skip duplicate errors
      }
    }

    navigate("/admin/work");
  }

  return (
    <div>
      <WorkForm onSubmit={handleSubmit} submitLabel="Create Work Experience" />
    </div>
  );
}