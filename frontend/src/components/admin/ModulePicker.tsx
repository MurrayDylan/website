import { useRef, useState } from "react";

export interface DraftTopic {
  title: string;
  displayOrder: number;
}

export interface DraftModule {
  name: string;
  grade?: string;
  description?: string;
  displayOrder: number;
  topics: DraftTopic[];
}

interface ModulePickerProps {
  modules: DraftModule[];
  onChange: (modules: DraftModule[]) => void;
}

export default function ModulePicker({ modules, onChange }: ModulePickerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState<DraftTopic[]>([]);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  function resetForm() {
    setName("");
    setGrade("");
    setDescription("");
    setTopicInput("");
    setTopics([]);
    setError(null);
    setIsAdding(false);
  }

  function handleAddTopic() {
    const trimmed = topicInput.trim();
    if (!trimmed) return;

    setTopics((prev) => [
      ...prev,
      { title: trimmed, displayOrder: prev.length },
    ]);
    setTopicInput("");
  }

  function handleRemoveTopic(index: number) {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSaveModule() {
    if (!name.trim()) {
      setError("Module name is required");
      return;
    }

    const newModule: DraftModule = {
      name: name.trim(),
      grade: grade.trim() || undefined,
      description: description.trim() || undefined,
      displayOrder: modules.length,
      topics,
    };

    onChange([...modules, newModule]);
    resetForm();
  }

  function removeModule(index: number) {
    const updated = modules
      .filter((_, i) => i !== index)
      .map((mod, newOrder) => ({ ...mod, displayOrder: newOrder }));
    onChange(updated);
  }

  function moveModule(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= modules.length) return;

    const container = listRef.current;
    const beforeRects = new Map<string, DOMRect>();

    if (container) {
      Array.from(container.children).forEach((element) => {
        const key = element.getAttribute("data-module-key");
        if (key) {
          beforeRects.set(key, element.getBoundingClientRect());
        }
      });
    }

    const updated = [...modules];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    const reordered = updated.map((mod, newOrder) => ({
      ...mod,
      displayOrder: newOrder,
    }));

    onChange(reordered);

    requestAnimationFrame(() => {
      if (!container) return;

      Array.from(container.children).forEach((element) => {
        const key = element.getAttribute("data-module-key");
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
    <div className="flex flex-col gap-3 text-sm">
      <span className="font-medium text-white">Key Modules</span>

      {modules.length > 0 && (
        <div ref={listRef} className="flex flex-col gap-2">
          {modules.map((mod, index) => (
            <div
              key={mod.name}
              data-module-key={mod.name}
              className="flex items-center justify-between bg-neutral-900 p-3 rounded-lg border border-neutral-800"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-200">{mod.name}</span>
                  {mod.grade && <span className="text-xs text-blue-300 font-mono">({mod.grade})</span>}
                </div>
                {mod.topics && mod.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mod.topics.map((t, ti) => (
                      <span key={ti} className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                        {t.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-md border border-neutral-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => moveModule(index, "up")}
                    disabled={index === 0}
                    title="Move up"
                    className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-25"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveModule(index, "down")}
                    disabled={index === modules.length - 1}
                    title="Move down"
                    className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-25 border-l border-neutral-700"
                  >
                    ↓
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeModule(index)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="self-start text-xs text-blue-400 hover:text-blue-300"
        >
          + Add Module
        </button>
      ) : (
        <div className="flex flex-col gap-3 rounded-md border border-neutral-700 bg-neutral-900 p-3">
          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Module Name (e.g. Data Structures)"
              className="rounded-md bg-neutral-800 px-2 py-1.5 border border-neutral-700 text-xs text-white"
            />
            <input
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Grade (optional, e.g. 1st Class)"
              className="rounded-md bg-neutral-800 px-2 py-1.5 border border-neutral-700 text-xs text-white"
            />
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="rounded-md bg-neutral-800 px-2 py-1.5 border border-neutral-700 text-xs text-white"
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="Add topic (press enter)"
                className="flex-1 rounded-md bg-neutral-800 px-2 py-1.5 border border-neutral-700 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="rounded-md bg-neutral-700 px-3 py-1.5 text-xs text-white hover:bg-neutral-600"
              >
                Add Topic
              </button>
            </div>

            {topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {topics.map((top, ti) => (
                  <span key={ti} className="flex items-center gap-1 text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                    {top.title}
                    <button type="button" onClick={() => handleRemoveTopic(ti)} className="text-neutral-500 hover:text-red-400 ml-0.5">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={handleSaveModule}
              className="rounded-md bg-blue-500 hover:bg-blue-400 px-3 py-1.5 text-xs font-medium text-white"
            >
              Save Module
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}