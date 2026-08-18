import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  checkMediaHash,
  uploadMedia,
  resolveMediaUrl,
} from "../../api/portfolioApi";
import { computeSHA256 } from "../../util/crypto";
import { type StagedMediaItem } from "./ProjectMediaEditor";

interface PageMediaEditorProps {
  mediaItems: StagedMediaItem[];
  onChange: (items: StagedMediaItem[]) => void;
  token: string;
  onProcessingChange?: (processing: boolean) => void;
}

export default function PageMediaEditor({
  mediaItems,
  onChange,
  token,
  onProcessingChange,
}: PageMediaEditorProps) {
  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [isHorizontal, setIsHorizontal] = useState(false);

  const [isProcessing, setIsProcessing] =
    useState(false);
  const [isDragOver, setIsDragOver] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const listRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    onProcessingChange?.(isProcessing);
  }, [isProcessing, onProcessingChange]);

  function startEditing(index: number) {
    const item = mediaItems[index];

    setCaption(item.caption ?? "");
    setAltText(item.altText ?? "");
    setIsHorizontal(item.isHorizontal ?? false);
    setEditingIndex(index);
    setError(null);
  }

  function resetEditor() {
    setCaption("");
    setAltText("");
    setIsHorizontal(false);
    setEditingIndex(null);
    setError(null);
  }

  async function handleFiles(files: File[]) {
    if (isProcessing || files.length === 0) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const failedFiles: string[] = [];

    try {
      let currentItems = [...mediaItems];

      for (const file of files) {
        try {
          const hash = await computeSHA256(file);

          let media = await checkMediaHash(hash);

          if (!media) {
            media = await uploadMedia(
              file,
              hash,
              token
            );
          }

          const newMediaItem: StagedMediaItem = {
            mediaId: media.id,
            originalFilename:
              media.originalFilename,
            contentType: media.contentType,
            fileSize: media.fileSize,
            displayOrder: currentItems.length,
            viewUrl: media.viewUrl,
            isHorizontal: false,
          };

          currentItems = [
            ...currentItems,
            newMediaItem,
          ];

          onChange(currentItems);
        } catch {
          failedFiles.push(file.name);
        }
      }

      if (failedFiles.length > 0) {
        setError(
          `Failed to upload: ${failedFiles.join(
            ", "
          )}`
        );
      }
    } finally {
      setIsProcessing(false);
    }
  }

  function handleFileInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length > 0) {
      void handleFiles(files);
    }

    event.target.value = "";
  }

  function handleDragOver(
    event: React.DragEvent<HTMLLabelElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!isProcessing) {
      setIsDragOver(true);
    }
  }

  function handleDragLeave(
    event: React.DragEvent<HTMLLabelElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(false);
  }

  function handleDrop(
    event: React.DragEvent<HTMLLabelElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(false);

    if (isProcessing) {
      return;
    }

    const files = Array.from(
      event.dataTransfer.files ?? []
    );

    if (files.length > 0) {
      void handleFiles(files);
    }
  }

  function handleSaveEdit() {
    if (editingIndex === null) {
      return;
    }

    const updatedItems = [...mediaItems];
    const currentItem = updatedItems[editingIndex];

    updatedItems[editingIndex] = {
      ...currentItem,
      caption: caption.trim() || undefined,
      altText: altText.trim() || undefined,
      isHorizontal:
        currentItem.contentType === "application/pdf"
          ? isHorizontal
          : undefined,
    };

    onChange(updatedItems);
    resetEditor();
  }

  function moveMedia(
    index: number,
    direction: "up" | "down"
  ) {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= mediaItems.length
    ) {
      return;
    }

    const container = listRef.current;

    const beforeRects = new Map<
      string,
      DOMRect
    >();

    if (container) {
      Array.from(
        container.children
      ).forEach((element) => {
        const key =
          element.getAttribute(
            "data-media-key"
          );

        if (key) {
          beforeRects.set(
            key,
            element.getBoundingClientRect()
          );
        }
      });
    }

    const updatedItems = [...mediaItems];

    [
      updatedItems[index],
      updatedItems[newIndex],
    ] = [
      updatedItems[newIndex],
      updatedItems[index],
    ];

    updatedItems.forEach(
      (item, newOrder) => {
        item.displayOrder = newOrder;
      }
    );

    onChange(updatedItems);

    requestAnimationFrame(() => {
      if (!container) {
        return;
      }

      Array.from(
        container.children
      ).forEach((element) => {
        const key =
          element.getAttribute(
            "data-media-key"
          );

        if (!key) {
          return;
        }

        const before = beforeRects.get(key);

        if (!before) {
          return;
        }

        const after =
          element.getBoundingClientRect();

        const deltaX =
          before.left - after.left;

        const deltaY =
          before.top - after.top;

        if (
          deltaX === 0 &&
          deltaY === 0
        ) {
          return;
        }

        element.animate(
          [
            {
              transform: `translate(${deltaX}px, ${deltaY}px)`,
            },
            {
              transform:
                "translate(0, 0)",
            },
          ],
          {
            duration: 180,
            easing:
              "cubic-bezier(0.2, 0, 0, 1)",
          }
        );
      });
    });
  }

  function removeMedia(index: number) {
    const updatedItems = mediaItems
      .filter((_, i) => i !== index)
      .map((item, newIndex) => ({
        ...item,
        displayOrder: newIndex,
      }));

    onChange(updatedItems);

    if (editingIndex === index) {
      resetEditor();
    } else if (
      editingIndex !== null &&
      editingIndex > index
    ) {
      setEditingIndex(
        editingIndex - 1
      );
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(
        1
      )} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">
          Attached Page Media
        </label>

        <span className="text-xs text-neutral-500">
          {mediaItems.length}{" "}
          {mediaItems.length === 1
            ? "item"
            : "items"}
        </span>
      </div>

      {/* Upload / Drop Zone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition ${
          isProcessing
            ? "cursor-wait border-blue-400 bg-blue-500/10"
            : isDragOver
            ? "border-blue-400 bg-blue-500/10"
            : "border-neutral-700 bg-neutral-800/60 hover:border-neutral-500 hover:bg-neutral-800"
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <>
            <div className="mb-3 h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-blue-400" />

            <p className="text-sm font-medium text-blue-300">
              Uploading media…
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              Please wait until all files have
              finished uploading
            </p>
          </>
        ) : isDragOver ? (
          <>
            <div className="mb-2 text-xl text-blue-400">
              ↓
            </div>

            <p className="text-sm font-medium text-blue-300">
              Drop media here
            </p>
          </>
        ) : (
          <>
            <div className="mb-2 text-xl text-neutral-400">
              +
            </div>

            <p className="text-sm font-medium text-neutral-300">
              Drag media here, or click to browse
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              You can select multiple files
            </p>
          </>
        )}
      </label>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 rounded px-2.5 py-1.5">
          {error}
        </p>
      )}

      {/* Media List */}
      <div
        ref={listRef}
        className="flex flex-col gap-3"
      >
        {mediaItems.map((item, index) => (
          <div
            key={item.mediaId}
            data-media-key={item.mediaId}
            className="rounded-md border border-neutral-700 bg-neutral-800/60 px-4 py-3"
          >
            {editingIndex === index ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-white">
                  Editing Metadata:{" "}
                  {item.originalFilename}
                </p>

                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Caption
                  <input
                    value={caption}
                    onChange={(e) =>
                      setCaption(e.target.value)
                    }
                    className="rounded-md bg-neutral-900 px-3 py-2 border border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
                    placeholder="Hero image or inline asset caption"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm text-neutral-300">
                  Alt Text
                  <input
                    value={altText}
                    onChange={(e) =>
                      setAltText(e.target.value)
                    }
                    className="rounded-md bg-neutral-900 px-3 py-2 border border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
                    placeholder="Image description for accessibility"
                  />
                </label>

                {/* Conditional Horizontal Toggle for PDFs */}
                {item.contentType === "application/pdf" && (
                  <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isHorizontal}
                      onChange={(e) =>
                        setIsHorizontal(e.target.checked)
                      }
                      className="rounded bg-neutral-900 border-neutral-700 text-blue-500 focus:ring-blue-500"
                    />
                    Landscape / Presentation layout (e.g., PowerPoint)
                  </label>
                )}

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
                    onClick={handleSaveEdit}
                    className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-400"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex items-center gap-3">
                  {item.contentType.startsWith(
                    "image/"
                  ) && (
                      <img
                        src={resolveMediaUrl(
                          item.viewUrl,
                          item.mediaId
                        )}
                        alt={
                          item.altText ||
                          item.originalFilename
                        }
                        className="w-10 h-10 object-cover rounded border border-neutral-700 shrink-0"
                      />
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {item.originalFilename}
                      </p>

                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 uppercase shrink-0">
                        {item.contentType}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      Order: {item.displayOrder} •{" "}
                      {formatFileSize(
                        item.fileSize
                      )}
                      {item.contentType === "application/pdf" &&
                        ` • Layout: ${item.isHorizontal ? "Landscape" : "Portrait"}`}
                      {item.caption
                        ? ` • "${item.caption}"`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center rounded-md border border-neutral-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        moveMedia(
                          index,
                          "up"
                        )
                      }
                      disabled={index === 0}
                      title="Move up"
                      className="px-2 py-1.5 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveMedia(
                          index,
                          "down"
                        )
                      }
                      disabled={
                        index ===
                        mediaItems.length - 1
                      }
                      title="Move down"
                      className="px-2 py-1.5 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 border-l border-neutral-700"
                    >
                      ↓
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(index)
                    }
                    disabled={isProcessing}
                    className="text-sm text-neutral-400 hover:text-white transition disabled:opacity-40"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeMedia(index)
                    }
                    disabled={isProcessing}
                    className="text-sm text-red-400 hover:text-red-300 transition disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}