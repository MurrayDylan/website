import { useEffect, useState } from "react";
import { fetchTechnologies, createTechnology } from "../../api/portfolioApi";
import { type TechnologyResponse } from "../../api/responseTypes";
import Chip from "../shared/Chip";

interface TechnologyPickerProps {
  selected: TechnologyResponse[];
  onChange: (technologies: TechnologyResponse[]) => void;
  token: string;
  showBrowser?: boolean;
}

export default function TechnologyPicker({
  selected,
  onChange,
  token,
  showBrowser = true,
}: TechnologyPickerProps) {
  const [allTechnologies, setAllTechnologies] = useState<TechnologyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(!showBrowser);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTechnologies()
      .then(setAllTechnologies)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : "Failed to load technologies")
      )
      .finally(() => setIsLoading(false));
  }, []);

  const selectedIds = new Set(selected.map((t) => t.id));

  // Only technologies NOT already selected show up as pickable —
  // selecting one moves it out of here and into the active row below.
  const availableTechnologies = allTechnologies.filter((t) => !selectedIds.has(t.id));

  const groupedByCategory = availableTechnologies.reduce<Record<string, TechnologyResponse[]>>(
    (groups, tech) => {
      if (!groups[tech.category]) groups[tech.category] = [];
      groups[tech.category].push(tech);
      return groups;
    },
    {}
  );

  const trimmedNewName = newName.trim();
  const duplicateMatch = trimmedNewName
    ? allTechnologies.find(
        (t) => t.name.toLowerCase() === trimmedNewName.toLowerCase()
      )
    : undefined;

  function addExisting(tech: TechnologyResponse) {
    onChange([...selected, tech]);
  }

  function removeSelected(id: number) {
    onChange(selected.filter((t) => t.id !== id));
  }

  function resetAddForm() {
    setIsAdding(showBrowser ? false : true);
    setCreateError(null);
    setNewName("");
    setNewCategory("");
  }

  async function handleCreate() {
    const name = newName.trim();
    const category = newCategory.trim();

    if (!name) {
      setCreateError("Name is required");
      return;
    }

    if (duplicateMatch) {
      if (!selectedIds.has(duplicateMatch.id)) {
        addExisting(duplicateMatch);
      }
      resetAddForm();
      return;
    }

    if (!category) {
      setCreateError("Category is required");
      return;
    }

    setCreateError(null);
    setIsCreating(true);

    try {
      const created = await createTechnology({ name, category }, token);
      setAllTechnologies((prev) => [...prev, created]);
      addExisting(created);
      resetAddForm();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create technology");
    } finally {
      setIsCreating(false);
    }
  }

  const addFormBody = (
    <div className="flex flex-col gap-2 rounded-md border border-neutral-700 bg-neutral-900 p-2">
      {createError && <p className="text-xs text-red-400">{createError}</p>}

      {duplicateMatch && !createError && (
        <p className="text-xs text-neutral-500">
          "{duplicateMatch.name}" already exists under "{duplicateMatch.category}" —
          this will add the existing one.
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setCreateError(null);
          }}
          placeholder="Name (e.g. Docker)"
          className="w-full rounded-md bg-neutral-800 px-2.5 py-1.5 border border-neutral-700 text-xs focus:outline-none focus:border-neutral-500"
        />
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category (e.g. Tools)"
          disabled={Boolean(duplicateMatch)}
          className="w-full rounded-md bg-neutral-800 px-2.5 py-1.5 border border-neutral-700 text-xs disabled:opacity-40 focus:outline-none focus:border-neutral-500"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
          className="shrink-0 rounded-md bg-blue-500 hover:bg-blue-400 disabled:opacity-50 px-3 py-1.5 text-xs font-medium text-white"
        >
          {isCreating ? "Creating…" : duplicateMatch ? "Add existing" : "Create"}
        </button>
        {showBrowser && (
          <button
            type="button"
            onClick={resetAddForm}
            className="shrink-0 text-xs text-neutral-400 hover:text-white px-1"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span>Technologies</span>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tech) => (
            <Chip
              key={tech.id}
              label={tech.name}
              selected
              removable
              onClick={() => removeSelected(tech.id)}
            />
          ))}
        </div>
      )}

      {showBrowser && (
        <>
          {isLoading && <p className="text-xs text-neutral-500">Loading technologies…</p>}
          {loadError && <p className="text-xs text-red-400">{loadError}</p>}

          {!isLoading && !loadError && (
            <div className="flex flex-col gap-2 rounded-md border border-neutral-700 bg-neutral-900 p-3 max-h-48 overflow-y-auto">
              {availableTechnologies.length === 0 ? (
                <p className="text-xs text-neutral-500">All technologies selected.</p>
              ) : (
                Object.keys(groupedByCategory)
                  .sort()
                  .map((category) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-neutral-500 mb-1">{category}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {groupedByCategory[category].map((tech) => (
                          <Chip
                            key={tech.id}
                            label={tech.name}
                            onClick={() => addExisting(tech)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}

          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="self-start text-xs text-blue-400 hover:text-blue-300"
            >
              + Add Technology
            </button>
          ) : (
            addFormBody
          )}
        </>
      )}

      {!showBrowser && addFormBody}
    </div>
  );
}