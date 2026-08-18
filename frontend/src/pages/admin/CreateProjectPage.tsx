import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import {
  createProject,
  attachMediaToProject,
} from "../../api/portfolioApi";
import { type ProjectRequest } from "../../api/requestTypes";
import ProjectForm from "../../components/admin/ProjectForm";
import { type StagedMediaItem } from "../../components/admin/ProjectMediaEditor";

export default function CreateProjectPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  useEffect(() => {
    setTitleOverride(null);
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
    if (!token) return;

    // 1. Create the base project
    const project = await createProject(data, token);

    // 2. Attach media from the basket upon submit
    for (const item of mediaItems) {
      if (!item.mediaId || isNaN(item.mediaId)) continue;

      try {
        await attachMediaToProject(
          project.id,
          item.mediaId,
          {
            displayOrder: Number(item.displayOrder) || 0,
            caption: item.caption ?? undefined,
            altText: item.altText ?? undefined,
            isHorizontal: item.isHorizontal,
          },
          token
        );
      } catch (err) {
        // Silently ignore duplicate/attachment errors
      }
    }

    navigate("/admin/projects");
  }

  return (
    <div>
      <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
    </div>
  );
}