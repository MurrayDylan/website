import { useState } from "react";
import { type ProjectLinkRequest } from "../../api/requestTypes";

interface ProjectLinkEditorProps {
  links: ProjectLinkRequest[];
  onChange: (links: ProjectLinkRequest[]) => void;
}

export default function ProjectLinkEditor({
  links,
  onChange,
}: ProjectLinkEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetEditor() {
    setLabel("");
    setUrl("");
    setIsInternal(false);
    setError(null);
    setIsAdding(false);
    setEditingIndex(null);
  }

  function startAdding() {
    resetEditor();
    setIsAdding(true);
  }

  function startEditing(index: number) {
    const link = links[index];

    setLabel(link.label);
    setUrl(link.url);
    // Automatically flag as internal if it doesn't start with http:// or https://
    setIsInternal(!/^https?:\/\//i.test(link.url));
    setEditingIndex(index);
    setError(null);
    setIsAdding(false);
  }

  function saveLink() {
    const trimmedLabel = label.trim();
    let trimmedUrl = url.trim();

    if (!trimmedLabel || !trimmedUrl) {
      return;
    }

    if (!isInternal) {
      // Check if it has http:// or https://, if not prefix https://
      const hasProtocol = /^https?:\/\//i.test(trimmedUrl);
      if (!hasProtocol) {
        trimmedUrl = `https://${trimmedUrl}`;
      }

      // checks if user has ended url with a .dot (also allows for '/'s, but this is mostly by accident lol)
      const urlPattern = /\.[a-zA-Z]{2,}/i;
      if (!urlPattern.test(trimmedUrl)) {
        setError("Please enter a valid-looking URL (e.g., includes a domain like .com)");
        return;
      }
    }

    const newLink: ProjectLinkRequest = {
      label: trimmedLabel,
      url: trimmedUrl,
    };

    if (editingIndex !== null) {
      const updatedLinks = [...links];
      updatedLinks[editingIndex] = newLink;
      onChange(updatedLinks);
    } else {
      onChange([...links, newLink]);
    }

    resetEditor();
  }

  function handleEditorKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveLink();
    }
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          Project Links
        </label>

        {!isAdding && editingIndex === null && (
          <button
            type="button"
            onClick={startAdding}
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            + Add Link
          </button>
        )}
      </div>

      {/* Add Link Form */}
      {isAdding && (
        <div className="rounded-md border border-neutral-700 bg-neutral-800/60 px-4 py-4">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-white">
              Add Project Link
            </p>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 rounded px-2 py-1">
                {error}
              </p>
            )}

            <label className="flex flex-col gap-1 text-sm">
              Label
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                className="rounded-md bg-neutral-900 px-3 py-2 border border-neutral-700 text-white placeholder:text-neutral-500"
                placeholder="GitHub"
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              URL
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                className="rounded-md bg-neutral-900 px-3 py-2 border border-neutral-700 text-white placeholder:text-neutral-500"
                placeholder="https://github.com/..."
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded bg-neutral-900 border-neutral-700 text-blue-500 focus:ring-blue-500"
              />
              Internal link (skip domain check)
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetEditor}
                className="rounded-md px-3 py-2 text-sm text-neutral-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveLink}
                disabled={!label.trim() || !url.trim()}
                className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Links List */}
      {links.map((link, index) => (
        <div
          key={`${link.label}-${index}`}
          className="rounded-md border border-neutral-700 bg-neutral-800/60 px-4 py-3"
        >
          {editingIndex === index ? (
            <div className="flex flex-col gap-3">
              {error && (
                <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 rounded px-2 py-1">
                  {error}
                </p>
              )}

              <label className="flex flex-col gap-1 text-sm">
                Label
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  className="rounded-md bg-neutral-900 px-3 py-2 border border-neutral-700"
                  placeholder="GitHub"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                URL
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  className="rounded-md bg-neutral-900 px-3 py-2 border border-neutral-700"
                  placeholder="https://github.com/... or /internal/path"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded bg-neutral-900 border-neutral-700 text-blue-500 focus:ring-blue-500"
                />
                Internal link (skip domain check)
              </label>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetEditor}
                  className="rounded-md px-3 py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveLink}
                  disabled={!label.trim() || !url.trim()}
                  className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-400 disabled:opacity-50"
                >
                  Save Link
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  {link.label}
                </p>

                <p className="text-sm text-neutral-400 truncate">
                  {link.url}
                </p>
              </div>

              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => startEditing(index)}
                  className="text-sm text-neutral-400 hover:text-white transition"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}