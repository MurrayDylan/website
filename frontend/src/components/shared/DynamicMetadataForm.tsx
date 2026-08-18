import {
  BLOCK_SCHEMAS,
  BLOCK_OPTIONS,
  ARRAY_ITEM_SCHEMAS,
} from "../../admin/schemaRegistry";

interface DynamicMetadataFormProps {
  data: Record<string, any>;
  onChange: (updatedData: Record<string, any>) => void;
}

export default function DynamicMetadataForm({
  data,
  onChange,
}: DynamicMetadataFormProps) {
  // handleFieldChange only ever updates ONE key on the CURRENT `data`
  // object. Every recursive call already receives `data` scoped to
  // exactly the subtree it's editing, and every recursive call's
  // `onChange` already knows how to merge its result back into its
  // parent. So there's no need to walk a multi-segment path — doing
  // so was the bug (it applied an ancestor-relative path to an
  // already-scoped object, creating phantom nested keys instead of
  // updating the real field).
  function handleFieldChange(key: string, value: any) {
    onChange({
      ...data,
      [key]: value,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(data).map(([key, value]) => {
        // ---------------------------------------------------------------
        // Block type identifier
        // ---------------------------------------------------------------

        if (key === "_type") {
          return (
            <div
              key={key}
              className="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded w-fit"
            >
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                Block Type: {String(value)}
              </span>
            </div>
          );
        }

        // ---------------------------------------------------------------
        // Nested objects
        // ---------------------------------------------------------------

        if (
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          const entries = Object.entries(value);

          const isMapOfObjects =
            entries.length > 0 &&
            entries.every(
              ([, v]) =>
                v !== null &&
                typeof v === "object" &&
                !Array.isArray(v)
            );

          // -------------------------------------------------------------
          // Map of objects
          // -------------------------------------------------------------

          if (isMapOfObjects) {
            return (
              <div
                key={key}
                className="flex flex-col gap-3 p-3 rounded bg-neutral-900/60 border border-neutral-800"
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {key.replace(/_/g, " ")} ({entries.length})
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const rawKey = window.prompt(
                        `Enter identifier key for new entry in ${key}:`
                      );

                      if (!rawKey) {
                        return;
                      }

                      const newSubKey = rawKey
                        .trim()
                        .replace(/\s+/g, "");

                      if (!newSubKey || value[newSubKey]) {
                        window.alert(
                          "Invalid or duplicate key!"
                        );
                        return;
                      }

                      const firstChild = entries[0]?.[1] as
                        | Record<string, any>
                        | undefined;

                      const template = firstChild
                        ? Object.keys(firstChild).reduce(
                            (acc, childKey) => ({
                              ...acc,
                              [childKey]: Array.isArray(
                                firstChild[childKey]
                              )
                                ? []
                                : "",
                            }),
                            {}
                          )
                        : {};

                      handleFieldChange(key, {
                        ...value,
                        [newSubKey]: template,
                      });
                    }}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded transition"
                  >
                    + Add Entry
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {entries.map(([subKey, subValue]) => (
                    <div
                      key={subKey}
                      className="relative p-3 rounded bg-neutral-800/40 border border-neutral-700/60 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-700/40">
                        <span className="text-xs font-mono text-neutral-300">
                          {subKey}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...value };
                            delete updated[subKey];

                            handleFieldChange(key, updated);
                          }}
                          className="text-[11px] text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>

                      <DynamicMetadataForm
                        data={subValue as Record<string, any>}
                        onChange={(updated) =>
                          handleFieldChange(key, {
                            ...value,
                            [subKey]: updated,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // -------------------------------------------------------------
          // Standard object
          // -------------------------------------------------------------

          return (
            <div
              key={key}
              className="flex flex-col gap-2 p-3 rounded bg-neutral-900/60 border border-neutral-800"
            >
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {key.replace(/_/g, " ")}
              </span>

              {entries.length === 0 ? (
                <span className="text-[11px] text-neutral-500">
                  Empty object
                </span>
              ) : (
                <div className="flex flex-col gap-2 pl-3 border-l border-neutral-800">
                  <DynamicMetadataForm
                    data={value}
                    onChange={(subUpdated) =>
                      handleFieldChange(key, subUpdated)
                    }
                  />
                </div>
              )}
            </div>
          );
        }

        // ---------------------------------------------------------------
        // Arrays
        // ---------------------------------------------------------------

        if (Array.isArray(value)) {
          const isBlocksArray = key === "blocks";

          const isArrayOfObjects =
            value.length > 0 &&
            typeof value[0] === "object" &&
            value[0] !== null &&
            !Array.isArray(value[0]);

          // -------------------------------------------------------------
          // Array of objects / blocks
          // -------------------------------------------------------------

          if (isArrayOfObjects || isBlocksArray) {
            return (
              <div
                key={key}
                className="flex flex-col gap-3 p-3 rounded bg-neutral-900/60 border border-neutral-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {key.replace(/_/g, " ")} ({value.length})
                  </span>

                  {isBlocksArray ? (
                    <select
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition outline-none cursor-pointer"
                      value=""
                      onChange={(e) => {
                        const type = e.target.value;

                        if (!type) {
                          return;
                        }

                        const schema =
                          BLOCK_SCHEMAS[type];

                        if (!schema) {
                          return;
                        }

                        const template =
                          JSON.parse(
                            JSON.stringify(schema)
                          );

                        handleFieldChange(key, [
                          ...value,
                          template,
                        ]);
                      }}
                    >
                      <option value="">
                        + Add Block...
                      </option>

                      {BLOCK_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const template =
                          ARRAY_ITEM_SCHEMAS[key]
                            ? JSON.parse(
                                JSON.stringify(
                                  ARRAY_ITEM_SCHEMAS[key]
                                )
                              )
                            : value[0]
                              ? Object.keys(
                                  value[0]
                                ).reduce(
                                  (acc, childKey) => ({
                                    ...acc,
                                    [childKey]:
                                      Array.isArray(
                                        value[0][childKey]
                                      )
                                        ? []
                                        : "",
                                  }),
                                  {}
                                )
                              : {};

                        handleFieldChange(key, [
                          ...value,
                          template,
                        ]);
                      }}
                      className="text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1 rounded transition cursor-pointer"
                    >
                      + Add Item
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {value.map((item, index) => (
                    <div
                      key={index}
                      className="relative p-3 rounded bg-neutral-800/40 border border-neutral-700/60 flex flex-col gap-2 shadow-sm"
                    >
                      <div className="flex justify-between items-center pb-1 border-b border-neutral-700/40">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">
                          {item?._type
                            ? `${item._type} Block #${
                                index + 1
                              }`
                            : `Item #${index + 1}`}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleFieldChange(
                              key,
                              value.filter(
                                (_, i) => i !== index
                              )
                            )
                          }
                          className="text-[10px] text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>

                      <DynamicMetadataForm
                        data={item}
                        onChange={(updatedItem) => {
                          const newArray = [...value];
                          newArray[index] = updatedItem;
                          handleFieldChange(key, newArray);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // -------------------------------------------------------------
          // Array of primitives
          // -------------------------------------------------------------

          return (
            <label
              key={key}
              className="flex flex-col gap-1 text-xs text-neutral-300"
            >
              <span className="capitalize font-medium text-neutral-200">
                {key.replace(/_/g, " ")}{" "}
                <span className="text-neutral-500">
                  (Comma-separated)
                </span>
              </span>

              <input
                type="text"
                value={value.join(", ")}
                onChange={(e) =>
                  handleFieldChange(
                    key,
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs text-white font-mono"
              />
            </label>
          );
        }

        // ---------------------------------------------------------------
        // Primitive fields
        // ---------------------------------------------------------------

        return (
          <label
            key={key}
            className="flex flex-col gap-1 text-xs text-neutral-300"
          >
            <span className="capitalize font-medium text-neutral-200">
              {key.replace(/_/g, " ")}
            </span>

            {key
              .toLowerCase()
              .includes("description") ||
            key.toLowerCase().includes("content") ? (
              <textarea
                value={value ?? ""}
                onChange={(e) =>
                  handleFieldChange(key, e.target.value)
                }
                rows={4}
                className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs text-white font-mono resize-y"
              />
            ) : (
              <input
                type={
                  typeof value === "number"
                    ? "number"
                    : "text"
                }
                value={value ?? ""}
                onChange={(e) =>
                  handleFieldChange(
                    key,
                    typeof value === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
                className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs text-white font-mono"
              />
            )}
          </label>
        );
      })}
    </div>
  );
}