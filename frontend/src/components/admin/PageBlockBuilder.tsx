import { useState } from "react";
import { type PageBlock, type BlockType } from "../../admin/blocks";

interface Props {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
}

export default function PageBlockBuilder({
  blocks = [],
  onChange,
}: Props) {
  const [selectedType, setSelectedType] =
    useState<BlockType>("markdown");

  const addBlock = () => {
    const newId = crypto.randomUUID();

    let newBlock: PageBlock;

    switch (selectedType) {
      case "markdown":
        newBlock = {
          id: newId,
          type: "markdown",
          data: {
            _type: "markdown",
            content: "",
          },
        };
        break;

      case "hero":
        newBlock = {
          id: newId,
          type: "hero",
          data: {
            _type: "hero",
            title: "",
            subtitle: "",
          },
        };
        break;

      case "feature_grid":
        newBlock = {
          id: newId,
          type: "feature_grid",
          data: {
            _type: "featureGrid",
            sectionTitle: "",
            items: [],
          },
        };
        break;

      case "callout":
        newBlock = {
          id: newId,
          type: "callout",
          data: {
            _type: "callout",
            title: "",
            message: "",
            variant: "info",
          },
        };
        break;

      case "code":
        newBlock = {
          id: newId,
          type: "code",
          data: {
            _type: "code",
            language: "",
            filename: "",
            code: "",
          },
        };
        break;

      case "media":
        newBlock = {
          id: newId,
          type: "media",
          data: {
            _type: "media",
            items: [],
          },
        };
        break;

      default:
        newBlock = {
          id: newId,
          type: "markdown",
          data: {
            _type: "markdown",
            content: "",
          },
        };
    }

    onChange([...blocks, newBlock]);
  };

  const updateBlock = (
    index: number,
    updatedBlock: PageBlock
  ) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    onChange(
      blocks.filter((_, i) => i !== index)
    );
  };

  const moveBlock = (
    index: number,
    direction: "up" | "down"
  ) => {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >= blocks.length
    ) {
      return;
    }

    const newBlocks = [...blocks];

    const [moved] = newBlocks.splice(
      index,
      1
    );

    newBlocks.splice(
      target,
      0,
      moved
    );

    onChange(newBlocks);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-white">
        Page Blocks
      </h3>

      <div className="flex flex-col gap-4">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="border border-neutral-800 bg-neutral-900 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-800">
              <span className="text-sm font-mono text-blue-400 uppercase">
                {block.type.replace("_", " ")}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    moveBlock(index, "up")
                  }
                  disabled={index === 0}
                  className="text-xs px-2 py-1 bg-neutral-800 rounded disabled:opacity-50"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() =>
                    moveBlock(index, "down")
                  }
                  disabled={
                    index ===
                    blocks.length - 1
                  }
                  className="text-xs px-2 py-1 bg-neutral-800 rounded disabled:opacity-50"
                >
                  ↓
                </button>

                <button
                  type="button"
                  onClick={() =>
                    removeBlock(index)
                  }
                  className="text-xs px-2 py-1 bg-red-900/50 text-red-400 rounded"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Markdown */}
            {block.type === "markdown" && (
              <textarea
                className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white min-h-[100px]"
                placeholder="Markdown content..."
                value={block.data.content}
                onChange={(e) =>
                  updateBlock(index, {
                    ...block,
                    data: {
                      ...block.data,
                      content:
                        e.target.value,
                    },
                  })
                }
              />
            )}

            {/* Hero */}
            {block.type === "hero" && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  value={block.data.title}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        title:
                          e.target.value,
                      },
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Subtitle"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  value={
                    block.data.subtitle ??
                    ""
                  }
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        subtitle:
                          e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            {/* Feature Grid */}
            {block.type ===
              "feature_grid" && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Section title"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  value={
                    block.data
                      .sectionTitle ??
                    ""
                  }
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        sectionTitle:
                          e.target.value,
                      },
                    })
                  }
                />

                <p className="text-sm text-neutral-500">
                  Feature items can be
                  managed by the feature
                  grid editor.
                </p>
              </div>
            )}

            {/* Callout */}
            {block.type ===
              "callout" && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Title (optional)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  value={
                    block.data.title ??
                    ""
                  }
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        title:
                          e.target.value,
                      },
                    })
                  }
                />

                <select
                  value={
                    block.data.variant ??
                    "info"
                  }
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        variant:
                          e.target
                            .value as
                            | "info"
                            | "warning"
                            | "success"
                            | "quote",
                      },
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                >
                  <option value="info">
                    Info
                  </option>
                  <option value="warning">
                    Warning
                  </option>
                  <option value="success">
                    Success
                  </option>
                  <option value="quote">
                    Quote
                  </option>
                </select>

                <textarea
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white min-h-[100px]"
                  placeholder="Callout message..."
                  value={block.data.message}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        message:
                          e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            {/* Code */}
            {block.type === "code" && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Language (e.g. Java, TypeScript)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  value={
                    block.data.language ??
                    ""
                  }
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        language:
                          e.target.value,
                      },
                    })
                  }
                />

                <input
                  type="text"
                  placeholder="Filename (optional)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white"
                  value={
                    block.data.filename ??
                    ""
                  }
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        filename:
                          e.target.value,
                      },
                    })
                  }
                />

                <textarea
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-white font-mono min-h-[180px]"
                  placeholder="Code..."
                  value={block.data.code}
                  onChange={(e) =>
                    updateBlock(index, {
                      ...block,
                      data: {
                        ...block.data,
                        code:
                          e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}

            {/* Media */}
            {block.type === "media" && (
              <div className="text-sm text-neutral-400">
                Media block. Use the
                media editor to add
                attached images,
                documents, or other
                media.
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(
              e.target.value as BlockType
            )
          }
          className="bg-neutral-900 border border-neutral-800 text-white rounded p-2"
        >
          <option value="markdown">
            Markdown
          </option>

          <option value="hero">
            Hero Section
          </option>

          <option value="feature_grid">
            Feature Grid
          </option>

          <option value="callout">
            Callout
          </option>

          <option value="code">
            Code
          </option>

          <option value="media">
            Media
          </option>
        </select>

        <button
          type="button"
          onClick={addBlock}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Block
        </button>
      </div>
    </div>
  );
}