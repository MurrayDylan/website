import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import {
  updateWorkExperience,
  fetchWorkExperienceById,
  attachMediaToWork,
  updateWorkMedia,
  removeMediaFromWork,
} from "../../api/portfolioApi";
import { type WorkExperienceResponse } from "../../api/responseTypes";
import { type WorkExperienceRequest } from "../../api/requestTypes";
import WorkForm from "../../components/admin/WorkForm";
import { type StagedMediaItem } from "../../components/admin/ProjectMediaEditor";

export default function EditWorkPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();
  const [work, setWork] = useState<WorkExperienceResponse | null>(null);

  useEffect(() => {
    if (id) fetchWorkExperienceById(Number(id)).then(setWork);
  }, [id]);

  useEffect(() => {
    setTitleOverride("Edit Work Experience");
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
    if (!token || !id) return;

    const workId = Number(id);

    await updateWorkExperience(workId, data, token);

    const initialMediaIds = new Set<number>(
      (work?.media ?? []).map((m) => m.media.id)
    );
    const currentMediaIds = new Set<number>(mediaItems.map((m) => m.mediaId));

    for (const mediaId of initialMediaIds) {
      if (!currentMediaIds.has(mediaId)) {
        try {
          await removeMediaFromWork(workId, mediaId, token);
        } catch (err) {
          console.warn(`Failed to remove media ${mediaId}:`, err);
        }
      }
    }

    for (const item of mediaItems) {
      if (!item.mediaId) continue;

      const payload = {
        displayOrder: Number(item.displayOrder) || 0,
        caption: item.caption ?? undefined,
        altText: item.altText ?? undefined,
        isHorizontal: item.isHorizontal,
      };

      if (initialMediaIds.has(item.mediaId)) {
        try {
          await updateWorkMedia(workId, item.mediaId, payload, token);
        } catch (err) {}
      } else {
        try {
          await attachMediaToWork(workId, item.mediaId, payload, token);
        } catch (err) {}
      }
    }

    navigate("/admin/work");
  }

  if (!work) return <p className="text-sm text-neutral-400">Loading…</p>;

  return (
    <div>
      <WorkForm
        initialValues={work}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}