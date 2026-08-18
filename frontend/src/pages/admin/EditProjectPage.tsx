import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import {
  updateProject,
  fetchProjectById,
  attachMediaToProject,
  updateProjectMedia,
  removeMediaFromProject,
} from "../../api/portfolioApi";
import { type ProjectRequest } from "../../api/requestTypes";
import { type ProjectResponse } from "../../api/responseTypes";
import ProjectForm from "../../components/admin/ProjectForm";
import { type StagedMediaItem } from "../../components/admin/ProjectMediaEditor";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();
  const [project, setProject] = useState<ProjectResponse | null>(null);

  useEffect(() => {
    if (id) fetchProjectById(Number(id)).then(setProject);
  }, [id]);

  useEffect(() => {
    setTitleOverride("Edit Project");
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <button
          onClick={() => navigate("/admin/projects")}
          className="text-sm text-neutral-400 hover:text-white"
        >
          Close
        </button>
      </div>
    );

    return () => setHeaderAction(null);
  }, [navigate, setHeaderAction, setTitleOverride]);

  async function handleSubmit(
    data: ProjectRequest,
    mediaItems: StagedMediaItem[]
  ) {
    if (!token || !id) return;

    const projectId = Number(id);

    await updateProject(projectId, data, token);

    const initialMedia = project?.media ?? (project as any)?.projectMedia ?? [];
    const initialMediaIds = new Set<number>(
      initialMedia.map((m: any) => (m.media ? m.media.id : m.id)).filter(Boolean)
    );

    const currentMediaIds = new Set<number>(mediaItems.map((m) => m.mediaId));
    
    for (const mediaId of initialMediaIds) {
      if (!currentMediaIds.has(mediaId)) {
        try {
          await removeMediaFromProject(projectId, mediaId, token);
        } catch (err) {
          console.warn(`Failed to remove media ${mediaId} from project:`, err);
        }
      }
    }

    // 4. Process all media items in the current basket
    for (const item of mediaItems) {
      if (!item.mediaId || isNaN(item.mediaId)) continue;

      const attachmentPayload = {
        displayOrder: Number(item.displayOrder) || 0,
        caption: item.caption ?? undefined,
        altText: item.altText ?? undefined,
        isHorizontal: item.isHorizontal,
      };

      if (initialMediaIds.has(item.mediaId)) {
        try {
          await updateProjectMedia(projectId, item.mediaId, attachmentPayload, token);
        } catch (err) {
        }
      } else {
        try {
          await attachMediaToProject(projectId, item.mediaId, attachmentPayload, token);
        } catch (err) {

        }
      }
    }

    navigate("/admin/projects");
  }

  if (!project) return <p className="text-sm text-neutral-400">Loading…</p>;

  return (
    <div>
      <ProjectForm
        initialValues={project}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}