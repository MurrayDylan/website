import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchLayoutTemplates,
  createLayoutTemplate,
  updateLayoutTemplate,
  deleteLayoutTemplate,
} from "../../api/portfolioApi";
import { type LayoutTemplateResponse } from "../../api/responseTypes";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import Card from "../../components/shared/Card";

export default function AdminLayoutTemplatesPage() {
  const { token } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  const [templates, setTemplates] = useState<LayoutTemplateResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // New Layout Creation State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState("");
  const [newLayoutJson, setNewLayoutJson] = useState("{\n  \n}");

  // Inline Editing State
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editJson, setEditJson] = useState("");
  const [editContent, setEditContent] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitleOverride("Manage Layout Templates");
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <Link to="/admin" className="text-sm text-neutral-400 hover:text-white">
          ← Dashboard
        </Link>

        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setError(null);
          }}
          className="rounded bg-blue-500 hover:bg-blue-400 px-3 py-1.5 text-xs font-medium text-white transition cursor-pointer"
        >
          {showCreateForm ? "Cancel" : "+ Create Layout"}
        </button>

      </div>
    );
    return () => setHeaderAction(null);
  }, [setHeaderAction, setTitleOverride]);

  useEffect(() => {
    loadTemplates();
  }, []);

  function loadTemplates() {
    setLoading(true);
    fetchLayoutTemplates()
      .then(setTemplates)
      .catch(() => setError("Failed to fetch layout templates."))
      .finally(() => setLoading(false));
  }

  function startEditing(template: LayoutTemplateResponse) {
    setEditingType(template.layoutType);
    setEditName(template.layoutType);
    setEditJson(JSON.stringify(template.defaultMetadata ?? {}, null, 2));
    setEditContent(template.defaultContent ?? "");
    setError(null);
  }

  async function handleCreateNew() {
    if (!token || !newLayoutName.trim()) {
      setError("Please enter a layout name.");
      return;
    }

    let parsedMetadata = {};
    try {
      if (newLayoutJson.trim()) {
        parsedMetadata = JSON.parse(newLayoutJson);
      }
    } catch (err) {
      setError("Invalid JSON format in metadata.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formattedName = newLayoutName.trim().toUpperCase().replace(/\s+/g, "_");

      await createLayoutTemplate(
        {
          layoutType: formattedName,
          defaultMetadata: parsedMetadata,
          defaultContent: "",
        },
        token
      );

      setNewLayoutName("");
      setNewLayoutJson("{\n  \n}");
      setShowCreateForm(false);
      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create layout");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit(originalType: string) {
    if (!token) return;

    let parsedMetadata = {};
    try {
      parsedMetadata = JSON.parse(editJson);
    } catch (err) {
      setError("Invalid JSON format in metadata editor.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const formattedNewName = editName.trim().toUpperCase().replace(/\s+/g, "_");

      // If the layout name was changed, create the new record and delete the old one
      if (formattedNewName !== originalType) {
        await createLayoutTemplate(
          {
            layoutType: formattedNewName,
            defaultMetadata: parsedMetadata,
            defaultContent: editContent,
          },
          token
        );
        await deleteLayoutTemplate(originalType, token);
      } else {
        await updateLayoutTemplate(
          originalType,
          { defaultMetadata: parsedMetadata, defaultContent: editContent },
          token
        );
      }

      setEditingType(null);
      loadTemplates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save layout changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(type: string) {
    if (!token || !window.confirm(`Are you sure you want to delete template "${type}"?`)) {
      return;
    }

    try {
      await deleteLayoutTemplate(type, token);
      loadTemplates();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete layout template");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl pb-10">
      {/* Top Header & Create Button */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div>
          <p className="text-xs text-neutral-400">
            Define layout names, default JSON metadata schemas, and starter text
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* New Layout Form */}
      {showCreateForm && (
        <Card className="p-4 flex flex-col gap-3 border-blue-500/30 bg-neutral-900/90">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Create New Layout Template
          </h3>

          <label className="flex flex-col gap-1 text-xs text-neutral-300">
            Layout Name / Key
            <input
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              placeholder="e.g. HERO_SHOWCASE, GALLERY, or RESEARCH_PAPER"
              className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs font-mono text-white"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-neutral-300">
            Default Metadata Schema (JSON)
            <textarea
              value={newLayoutJson}
              onChange={(e) => setNewLayoutJson(e.target.value)}
              rows={4}
              className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs font-mono text-white"
            />
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNew}
              disabled={saving}
              className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-400 text-white rounded font-medium disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Creating…" : "Create Template"}
            </button>
          </div>
        </Card>
      )}

      {/* Vertical List of Existing Layout Cards */}
      {loading ? (
        <p className="text-xs text-neutral-500 py-2">Loading layout templates…</p>
      ) : templates.length === 0 ? (
        <p className="text-xs text-neutral-500 py-4 text-center">
          No layout templates found. Click "+ Create Layout" above to add one.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {templates.map((tpl) => (
            <Card
              key={tpl.layoutType}
              className="p-4 flex flex-col gap-3 bg-neutral-900/80 border-neutral-800"
            >
              {editingType === tpl.layoutType ? (
                /* Inline Edit Mode */
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-mono text-blue-400">
                      Editing Layout
                    </span>
                  </div>

                  <label className="flex flex-col gap-1 text-xs text-neutral-300">
                    Layout Name / Key
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs font-mono text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs text-neutral-300">
                    Default Metadata Schema (JSON)
                    <textarea
                      value={editJson}
                      onChange={(e) => setEditJson(e.target.value)}
                      rows={6}
                      className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs font-mono text-white"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs text-neutral-300">
                    Default Starter Content (Markdown)
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="rounded bg-neutral-800 border border-neutral-700 p-2 text-xs font-mono text-white"
                    />
                  </label>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditingType(null)}
                      className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(tpl.layoutType)}
                      disabled={saving}
                      className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-400 text-white rounded font-medium disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Static Display Mode */
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                    <span className="text-sm font-semibold font-mono text-blue-400">
                      {tpl.layoutType}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(tpl)}
                        className="text-xs text-neutral-300 hover:text-white transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tpl.layoutType)}
                        className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <pre className="text-[11px] font-mono text-neutral-300 bg-neutral-950 p-3 rounded border border-neutral-800/80 overflow-x-auto">
                    {JSON.stringify(tpl.defaultMetadata, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}