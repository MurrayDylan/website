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

export default function ModulePicker({
  modules,
  onChange,
}: ModulePickerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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
  }

  function startAdding() {
    resetForm();
    setEditingIndex(null);
    setIsAdding(true);
  }

  function startEditing(index: number) {
    const module = modules[index];

    setName(module.name);
    setGrade(module.grade ?? "");
    setDescription(module.description ?? "");
    setTopicInput("");
    setTopics(
      module.topics.map((topic, topicIndex) => ({
        ...topic,
        displayOrder: topicIndex,
      }))
    );
    setError(null);

    setIsAdding(false);
    setEditingIndex(index);
  }

  function cancelEditing() {
    resetForm();
    setEditingIndex(null);
  }

  function cancelAdding() {
    resetForm();
    setIsAdding(false);
  }

  function handleAddTopic() {
    const trimmed = topicInput.trim();

    if (!trimmed) return;

    setTopics((prev) => [
      ...prev,
      {
        title: trimmed,
        displayOrder: prev.length,
      },
    ]);

    setTopicInput("");
  }

  function handleRemoveTopic(index: number) {
    setTopics((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((topic, newOrder) => ({
          ...topic,
          displayOrder: newOrder,
        }))
    );
  }

  function handleSaveModule() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Module name is required");
      return;
    }

    const newModule: DraftModule = {
      name: trimmedName,
      grade: grade.trim() || undefined,
      description: description.trim() || undefined,
      displayOrder: modules.length,
      topics: topics.map((topic, index) => ({
        ...topic,
        displayOrder: index,
      })),
    };

    onChange([...modules, newModule]);

    resetForm();
    setIsAdding(false);
  }

  function handleSaveEdit() {
    if (editingIndex === null) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Module name is required");
      return;
    }

    const updated = modules.map((module, index) => {
      if (index !== editingIndex) {
        return module;
      }

      return {
        ...module,
        name: trimmedName,
        grade: grade.trim() || undefined,
        description: description.trim() || undefined,
        topics: topics.map((topic, topicIndex) => ({
          ...topic,
          displayOrder: topicIndex,
        })),
      };
    });

    onChange(updated);

    resetForm();
    setEditingIndex(null);
  }

  function removeModule(index: number) {
    if (editingIndex === index) {
      cancelEditing();
    }

    const updated = modules
      .filter((_, i) => i !== index)
      .map((module, newOrder) => ({
        ...module,
        displayOrder: newOrder,
      }));

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

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    const reordered = updated.map((module, newOrder) => ({
      ...module,
      displayOrder: newOrder,
    }));

    onChange(reordered);

    if (editingIndex === index) {
      setEditingIndex(newIndex);
    } else if (editingIndex === newIndex) {
      setEditingIndex(index);
    }

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
            {
              transform: `translate(${deltaX}px, ${deltaY}px)`,
            },
            {
              transform: "translate(0, 0)",
            },
          ],
          {
            duration: 180,
            easing: "cubic-bezier(0.2, 0, 0, 1)",
          }
        );
      });
    });
  }

  function renderModuleEditor(isNewModule = false) {
    return (
      <div className="flex flex-col gap-3">
        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Module Name (e.g. Data Structures)"
            className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white"
          />

          <input
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Grade (optional, e.g. 1st Class)"
            className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white"
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
              className="flex-1 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-white"
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
            <div className="mt-1 flex flex-wrap gap-1">
              {topics.map((topic, index) => (
                <span
                  key={`${topic.title}-${index}`}
                  className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300"
                >
                  {topic.title}

                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(index)}
                    className="ml-0.5 text-neutral-500 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={
              isNewModule ? handleSaveModule : handleSaveEdit
            }
            className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-400"
          >
            {isNewModule ? "Save Module" : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={
              isNewModule ? cancelAdding : cancelEditing
            }
            className="text-xs text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="font-medium text-white">Key Modules</span>

      {modules.length > 0 && (
        <div ref={listRef} className="flex flex-col gap-2">
          {modules.map((mod, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={`${mod.displayOrder}-${index}`}
                data-module-key={`${mod.displayOrder}-${index}`}
                className="rounded-lg border border-neutral-800 bg-neutral-900 p-3"
              >
                {isEditing ? (
                  renderModuleEditor()
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-neutral-200">
                          {mod.name}
                        </span>

                        {mod.grade && (
                          <span className="font-mono text-xs text-blue-300">
                            ({mod.grade})
                          </span>
                        )}
                      </div>

                      {mod.description && (
                        <p className="mt-1 text-xs text-neutral-500">
                          {mod.description}
                        </p>
                      )}

                      {mod.topics.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {mod.topics.map((topic, topicIndex) => (
                            <span
                              key={`${topic.title}-${topicIndex}`}
                              className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-400"
                            >
                              {topic.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <div className="flex items-center overflow-hidden rounded-md border border-neutral-700">
                        <button
                          type="button"
                          onClick={() =>
                            moveModule(index, "up")
                          }
                          disabled={index === 0}
                          title="Move up"
                          className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-25"
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveModule(index, "down")
                          }
                          disabled={
                            index === modules.length - 1
                          }
                          title="Move down"
                          className="border-l border-neutral-700 px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:opacity-25"
                        >
                          ↓
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => startEditing(index)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => removeModule(index)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isAdding ? (
        <button
          type="button"
          onClick={startAdding}
          className="self-start text-xs text-blue-400 hover:text-blue-300"
        >
          + Add Module
        </button>
      ) : (
        <div className="rounded-md border border-neutral-700 bg-neutral-900 p-3">
          {renderModuleEditor(true)}
        </div>
      )}
    </div>
  );
}