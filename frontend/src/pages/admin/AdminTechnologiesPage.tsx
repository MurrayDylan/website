import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import {
  fetchTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../../api/portfolioApi";
import { type TechnologyResponse } from "../../api/responseTypes";

export default function AdminTechnologiesPage() {
  const { token } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  const [technologies, setTechnologies] = useState<TechnologyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setTitleOverride("Skills");
    setHeaderAction(
    <div className="flex gap-4 items-center">
        <Link
            to="/admin"
            className="text-sm text-neutral-400 hover:text-white"
        >
      ← Dashboard
    </Link>
  </div>);

    loadTechnologies();

    return () => setHeaderAction(null);
  }, [setHeaderAction, setTitleOverride]);

  async function loadTechnologies() {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchTechnologies();
      setTechnologies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load technologies"
      );
    } finally {
      setLoading(false);
    }
  }

  const groupedTechnologies = useMemo(() => {
    const groups = new Map<string, TechnologyResponse[]>();

    for (const technology of technologies) {
      const category = technology.category || "Other";

      if (!groups.has(category)) {
        groups.set(category, []);
      }

      groups.get(category)!.push(technology);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, skills]) => ({
        category,
        skills: [...skills].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
  }, [technologies]);

  async function handleRenameCategory(oldCategory: string) {
    if (!token) return;

    const newCategory = categoryName.trim();

    if (!newCategory) {
      setActionError("Category name is required");
      return;
    }

    if (newCategory === oldCategory) {
      setEditingCategory(null);
      return;
    }

    const existingCategory = technologies.some(
      (technology) =>
        technology.category.toLowerCase() ===
          newCategory.toLowerCase() &&
        technology.category !== oldCategory
    );

    if (existingCategory) {
      setActionError("A category with that name already exists");
      return;
    }

    const skills = technologies.filter(
      (technology) => technology.category === oldCategory
    );

    setIsSaving(true);
    setActionError(null);

    try {
      const updatedSkills = await Promise.all(
        skills.map((technology) =>
          updateTechnology(
            technology.id,
            {
              name: technology.name,
              category: newCategory,
            },
            token
          )
        )
      );

      setTechnologies((current) =>
        current.map((technology) => {
          const updated = updatedSkills.find(
            (skill) => skill.id === technology.id
          );

          return updated ?? technology;
        })
      );

      setEditingCategory(null);
      setCategoryName("");
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to rename category"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startSkillEdit(technology: TechnologyResponse) {
    setSelectedId(technology.id);
    setEditingSkillId(technology.id);
    setSkillName(technology.name);
    setSkillCategory(technology.category);
    setEditingCategory(null);
    setActionError(null);
  }

  function cancelSkillEdit() {
    setEditingSkillId(null);
    setSkillName("");
    setSkillCategory("");
    setActionError(null);
  }

  async function handleUpdateSkill(
    technology: TechnologyResponse
  ) {
    if (!token) return;

    const name = skillName.trim();
    const category = skillCategory.trim();

    if (!name) {
      setActionError("Skill name is required");
      return;
    }

    if (!category) {
      setActionError("Category is required");
      return;
    }

    const duplicate = technologies.find(
      (item) =>
        item.id !== technology.id &&
        item.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      setActionError(
        `A skill named "${duplicate.name}" already exists`
      );
      return;
    }

    setIsSaving(true);
    setActionError(null);

    try {
      const updated = await updateTechnology(
        technology.id,
        {
          name,
          category,
        },
        token
      );

      setTechnologies((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item
        )
      );

      cancelSkillEdit();
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to update skill"
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSkill(
    technology: TechnologyResponse
  ) {
    if (!token) return;

    const confirmed = window.confirm(
      `Delete "${technology.name}"?`
    );

    if (!confirmed) return;

    setIsSaving(true);
    setActionError(null);

    try {
      await deleteTechnology(technology.id, token);

      setTechnologies((current) =>
        current.filter(
          (item) => item.id !== technology.id
        )
      );

      setSelectedId(null);
      setEditingSkillId(null);
      setSkillName("");
      setSkillCategory("");
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to delete skill"
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddSkill() {
    if (!token) return;

    const name = newSkillName.trim();
    const category = newSkillCategory.trim();

    if (!name) {
      setActionError("Skill name is required");
      return;
    }

    if (!category) {
      setActionError("Category is required");
      return;
    }

    const duplicate = technologies.some(
      (technology) =>
        technology.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {
      setActionError("A skill with that name already exists");
      return;
    }

    setIsSaving(true);
    setActionError(null);

    try {
      const created = await createTechnology(
        {
          name,
          category,
        },
        token
      );

      setTechnologies((current) => [
        ...current,
        created,
      ]);

      setNewSkillName("");
      setNewSkillCategory("");
      setIsAddingSkill(false);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Failed to create skill"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startCategoryEdit(category: string) {
    setActionError(null);
    setEditingCategory(category);
    setCategoryName(category);
    setEditingSkillId(null);
    setSelectedId(null);
  }

  function cancelCategoryEdit() {
    setEditingCategory(null);
    setCategoryName("");
  }

  function toggleSkill(technology: TechnologyResponse) {
    if (selectedId === technology.id) {
      setSelectedId(null);
      setEditingSkillId(null);
      setSkillName("");
      setSkillCategory("");
      setActionError(null);
      return;
    }

    setSelectedId(technology.id);
    setEditingSkillId(null);
    setActionError(null);
  }

  if (loading) {
    return (
      <div className="py-8 text-sm text-neutral-500">
        Loading skills…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Skills & Technologies
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage the skills and categories used throughout your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddingSkill(true);
            setActionError(null);
          }}
          className="shrink-0 rounded-md bg-blue-500 hover:bg-blue-400 px-3 py-2 text-xs font-medium text-white transition"
        >
          + Add Skill
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {actionError && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {actionError}
        </div>
      )}

      {isAddingSkill && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-medium text-white">
                Add Skill
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Add a new technology to your skills list.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={newSkillName}
                onChange={(e) => {
                  setNewSkillName(e.target.value);
                  setActionError(null);
                }}
                placeholder="Skill name"
                className="rounded-md bg-neutral-800 px-3 py-2 text-sm text-white border border-neutral-700 focus:outline-none focus:border-neutral-500"
              />

              <input
                value={newSkillCategory}
                onChange={(e) => {
                  setNewSkillCategory(e.target.value);
                  setActionError(null);
                }}
                placeholder="Category"
                className="rounded-md bg-neutral-800 px-3 py-2 text-sm text-white border border-neutral-700 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={isSaving}
                className="rounded-md bg-blue-500 hover:bg-blue-400 disabled:opacity-50 px-3 py-2 text-xs font-medium text-white transition"
              >
                {isSaving ? "Saving…" : "Add Skill"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAddingSkill(false);
                  setNewSkillName("");
                  setNewSkillCategory("");
                  setActionError(null);
                }}
                className="text-xs text-neutral-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {groupedTechnologies.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-800 p-8 text-center">
          <p className="text-sm text-neutral-400">
            No skills have been added yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groupedTechnologies.map(({ category, skills }) => {
            const isEditingCategory =
              editingCategory === category;

            return (
              <section
                key={category}
                className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  {isEditingCategory ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        autoFocus
                        value={categoryName}
                        onChange={(e) =>
                          setCategoryName(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleRenameCategory(category);
                          }

                          if (e.key === "Escape") {
                            cancelCategoryEdit();
                          }
                        }}
                        className="min-w-0 flex-1 rounded-md bg-neutral-800 px-2.5 py-1.5 text-sm text-white border border-neutral-700 focus:outline-none focus:border-neutral-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleRenameCategory(category)
                        }
                        disabled={isSaving}
                        className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={cancelCategoryEdit}
                        className="text-xs text-neutral-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {category}
                        </h3>

                        <span className="text-[10px] font-mono rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-500 shrink-0">
                          {skills.length}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          startCategoryEdit(category)
                        }
                        className="shrink-0 text-xs text-neutral-500 hover:text-white transition"
                      >
                        Edit category
                      </button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {skills.map((technology) => {
                    const selected =
                      selectedId === technology.id;

                    const editing =
                      editingSkillId === technology.id;

                    return (
                      <div
                        key={technology.id}
                        className={`rounded-md border transition ${
                          selected
                            ? "border-neutral-600 bg-neutral-800"
                            : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-800/60"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleSkill(technology)
                          }
                          className="w-full text-left px-3 py-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-neutral-200">
                              {technology.name}
                            </span>

                            <span className="text-xs text-neutral-600">
                              {selected ? "−" : "+"}
                            </span>
                          </div>
                        </button>

                        {selected && !editing && (
                          <div className="flex flex-wrap items-center gap-3 border-t border-neutral-800 px-3 py-2">
                            <button
                              type="button"
                              onClick={() =>
                                startSkillEdit(technology)
                              }
                              className="text-xs text-blue-400 hover:text-blue-300 transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSkill(
                                  technology
                                )
                              }
                              disabled={isSaving}
                              className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition"
                            >
                              Delete
                            </button>
                          </div>
                        )}

                        {editing && (
                          <div className="border-t border-neutral-800 p-3">
                            <div className="flex flex-col gap-2">
                              <input
                                autoFocus
                                value={skillName}
                                onChange={(e) => {
                                  setSkillName(e.target.value);
                                  setActionError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") {
                                    cancelSkillEdit();
                                  }

                                  if (
                                    e.key === "Enter" &&
                                    !isSaving
                                  ) {
                                    handleUpdateSkill(
                                      technology
                                    );
                                  }
                                }}
                                placeholder="Skill name"
                                className="w-full rounded-md bg-neutral-900 px-2.5 py-2 text-sm text-white border border-neutral-700 focus:outline-none focus:border-neutral-500"
                              />

                              <input
                                value={skillCategory}
                                onChange={(e) => {
                                  setSkillCategory(
                                    e.target.value
                                  );
                                  setActionError(null);
                                }}
                                placeholder="Category"
                                className="w-full rounded-md bg-neutral-900 px-2.5 py-2 text-sm text-white border border-neutral-700 focus:outline-none focus:border-neutral-500"
                              />

                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateSkill(
                                      technology
                                    )
                                  }
                                  disabled={isSaving}
                                  className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 transition"
                                >
                                  {isSaving
                                    ? "Saving…"
                                    : "Save"}
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelSkillEdit}
                                  disabled={isSaving}
                                  className="text-xs text-neutral-500 hover:text-white disabled:opacity-50 transition"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteSkill(
                                      technology
                                    )
                                  }
                                  disabled={isSaving}
                                  className="ml-auto text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}