import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import SaveStatusToast from "../../components/admin/SaveStatusToast";
import { ApiError, deleteProject, fetchProjects, reorderProjects } from "../../api/portfolioApi";
import { type ProjectResponse } from "../../api/responseTypes";

export default function AdminProjectPage() {
  const { token, logout } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  // Save status & pending changes tracking
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  async function loadProjects() {
    try {
      const data = await fetchProjects();
      const sortedData = [...data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setProjects(sortedData);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout();
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // 1. Prevent window exit/reload if there are pending or active saves
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingChanges || saveStatus === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasPendingChanges, saveStatus]);

  // 2. Render header action cleanly (removed inline status badge logic)
  useEffect(() => {
    setTitleOverride("Manage Projects");
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <Link to="/admin" className="text-sm text-neutral-400 hover:text-white">
          ← Dashboard
        </Link>
        <Link
          to="/admin/projects/new"
          className="rounded bg-blue-500 hover:bg-blue-400 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
        >
          + New Project
        </Link>
      </div>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, setTitleOverride]);

  // Clean up debounce timeout on component unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  async function handleDelete(id: number) {
    if (!token) return;
    try {
      await deleteProject(id, token);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setConfirmingDeleteId(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout();
    }
  }

  // Persists updated order to backend
  async function persistOrder(updatedProjects: ProjectResponse[]) {
    if (!token) return;

    setSaveStatus("saving");
    try {
      const ids = updatedProjects.map((p) => p.id);
      await reorderProjects({ ids }, token);

      // Reload from server to synchronize entity displayOrder indices
      await loadProjects();

      setSaveStatus("saved");
      setHasPendingChanges(false);

      setTimeout(() => {
        setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
      }, 2500);
    } catch (err) {
      setSaveStatus("error");
      setHasPendingChanges(false);
      if (err instanceof ApiError && err.status === 401) logout();
    }
  }

  function moveProject(id: number, direction: "up" | "down") {
    const container = listRef.current;
    const beforeRects = new Map<string, DOMRect>();

    if (container) {
      Array.from(container.children).forEach((element) => {
        const key = element.getAttribute("data-project-key");
        if (key) {
          beforeRects.set(key, element.getBoundingClientRect());
        }
      });
    }

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;

    // Compute the updated projects array deterministically
    const updatedProjects = [...projects];
    [updatedProjects[index], updatedProjects[newIndex]] = [
      updatedProjects[newIndex],
      updatedProjects[index],
    ];

    setProjects(updatedProjects);
    setHasPendingChanges(true);
    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      persistOrder(updatedProjects);
    }, 600);

    requestAnimationFrame(() => {
      if (!container) return;

      Array.from(container.children).forEach((element) => {
        const key = element.getAttribute("data-project-key");
        if (!key) return;

        const before = beforeRects.get(key);
        if (!before) return;

        const after = element.getBoundingClientRect();
        const deltaX = before.left - after.left;
        const deltaY = before.top - after.top;

        if (deltaX === 0 && deltaY === 0) return;

        element.animate(
          [
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: "translate(0, 0)" },
          ],
          {
            duration: 180,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          }
        );
      });
    });
  }

  return (
    <div className="relative">
      <SaveStatusToast status={saveStatus} />
      <div ref={listRef} className="flex flex-col gap-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            data-project-key={project.id}
            className="flex justify-between items-center p-4 rounded-lg bg-neutral-800"
          >
            <span>{project.title}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border border-neutral-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => moveProject(project.id, "up")}
                  disabled={index === 0}
                  title="Move up"
                  className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveProject(project.id, "down")}
                  disabled={index === projects.length - 1}
                  title="Move down"
                  className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 border-l border-neutral-700"
                >
                  ↓
                </button>
              </div>

              <div className="flex gap-3 text-sm">
                <Link to={`/admin/projects/${project.id}/edit`} className="text-blue-400 hover:underline">
                  Edit
                </Link>
                {confirmingDeleteId === project.id ? (
                  <>
                    <button onClick={() => handleDelete(project.id)} className="text-red-400">
                      Confirm delete
                    </button>
                    <button onClick={() => setConfirmingDeleteId(null)} className="text-neutral-400">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setConfirmingDeleteId(project.id)} className="text-neutral-400 hover:text-red-400">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}