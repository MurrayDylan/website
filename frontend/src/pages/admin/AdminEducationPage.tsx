import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import SaveStatusToast from "../../components/admin/SaveStatusToast";
import { ApiError, getEducation, deleteEducation, reorderEducation } from "../../api/portfolioApi";
import { type EducationResponse } from "../../api/responseTypes";

export default function AdminEducationPage() {
  const { token, logout } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();
  const [education, setEducation] = useState<EducationResponse[]>([]);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  async function loadEducation() {
    try {
      const data = await getEducation();
      const sortedData = [...data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setEducation(sortedData);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout();
    }
  }

  useEffect(() => {
    loadEducation();
  }, []);

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

  useEffect(() => {
    setTitleOverride("Manage Education");
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <Link to="/admin" className="text-sm text-neutral-400 hover:text-white">
          ← Dashboard
        </Link>
        <Link
          to="/admin/education/new"
          className="rounded bg-blue-500 hover:bg-blue-400 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
        >
          + New Education
        </Link>
      </div>
    );

    return () => setHeaderAction(null);
  }, [setHeaderAction, setTitleOverride]);

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
      await deleteEducation(id, token);
      setEducation((prev) => prev.filter((e) => e.id !== id));
      setConfirmingDeleteId(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) logout();
    }
  }

  async function persistOrder(updatedEducation: EducationResponse[]) {
    if (!token) return;

    setSaveStatus("saving");
    try {
      const ids = updatedEducation.map((e) => e.id);
      await reorderEducation({ ids }, token);

      await loadEducation();

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

  function moveEducation(id: number, direction: "up" | "down") {
    const container = listRef.current;
    const beforeRects = new Map<string, DOMRect>();

    if (container) {
      Array.from(container.children).forEach((element) => {
        const key = element.getAttribute("data-education-key");
        if (key) {
          beforeRects.set(key, element.getBoundingClientRect());
        }
      });
    }

    const index = education.findIndex((e) => e.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= education.length) return;

    const updatedEducation = [...education];
    [updatedEducation[index], updatedEducation[newIndex]] = [
      updatedEducation[newIndex],
      updatedEducation[index],
    ];

    setEducation(updatedEducation);
    setHasPendingChanges(true);
    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      persistOrder(updatedEducation);
    }, 600);

    requestAnimationFrame(() => {
      if (!container) return;

      Array.from(container.children).forEach((element) => {
        const key = element.getAttribute("data-education-key");
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
        {education.map((edu, index) => (
          <div
            key={edu.id}
            data-education-key={edu.id}
            className="flex justify-between items-center p-4 rounded-lg bg-neutral-800"
          >
            <div className="flex flex-col">
              <span className="font-medium text-white">{edu.qualification}</span>
              <span className="text-xs text-neutral-400">{edu.institution}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border border-neutral-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => moveEducation(edu.id, "up")}
                  disabled={index === 0}
                  title="Move up"
                  className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveEducation(edu.id, "down")}
                  disabled={index === education.length - 1}
                  title="Move down"
                  className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 border-l border-neutral-700"
                >
                  ↓
                </button>
              </div>

              <div className="flex gap-3 text-sm">
                <Link to={`/admin/education/${edu.id}/edit`} className="text-blue-400 hover:underline">
                  Edit
                </Link>
                {confirmingDeleteId === edu.id ? (
                  <>
                    <button onClick={() => handleDelete(edu.id)} className="text-red-400">
                      Confirm delete
                    </button>
                    <button onClick={() => setConfirmingDeleteId(null)} className="text-neutral-400">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setConfirmingDeleteId(edu.id)} className="text-neutral-400 hover:text-red-400">
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