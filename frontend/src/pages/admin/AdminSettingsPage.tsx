import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import Card from "../../components/shared/Card";
import { uploadCv, getCvDownloadUrl } from "../../api/portfolioApi";

import { HiOutlineDocumentDownload } from "react-icons/hi";

interface SiteSettings {
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  socialOne: string;
  socialTwo: string;
  socialThree: string;
}

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  const [settings, setSettings] = useState<SiteSettings>({
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    socialOne: "",
    socialTwo: "",
    socialThree: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CV Upload State & Drag State
  const [uploadingCv, setUploadingCv] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cvMessage, setCvMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setTitleOverride("Site Settings");
    setHeaderAction(
      <div className="flex gap-4 items-center">
        <Link to="/admin" className="text-sm text-neutral-400 hover:text-white">
          Close
        </Link>
      </div>
    );

    // Fetch existing settings from backend
    fetch("/api/settings", {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load site settings");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setSettings({
            email: data.email || "",
            githubUrl: data.githubUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            socialOne: data.socialOne || "",
            socialTwo: data.socialTwo || "",
            socialThree: data.socialThree || "",
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token, setHeaderAction, setTitleOverride]);

  function formatUrl(url: string) {
    if (!url.trim()) return url;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  }

  async function uploadCvFile(file: File) {
    if (!token) return;
    setUploadingCv(true);
    setCvMessage(null);

    try {
      await uploadCv(file, token);
      setCvMessage({ type: "success", text: "Successfully uploaded and replaced live CV" });
    } catch (err) {
      setCvMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred during upload.",
      });
    } finally {
      setUploadingCv(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void uploadCvFile(file);
    }
    e.target.value = "";
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!uploadingCv) setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (uploadingCv) return;

    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length > 0) {
      void uploadCvFile(files[0]);
    }
  }

  // --- Site Settings Form Submit ---
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      ...settings,
      githubUrl: formatUrl(settings.githubUrl),
      linkedinUrl: formatUrl(settings.linkedinUrl),
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save settings");

      setSettings(payload);
      setMessage({ type: "success", text: "Site settings updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred while saving.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-xs text-neutral-500 py-4">Loading site settings…</p>;
  }

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-3xl">
      {/* ------------------------------------------------------------------ */}
      {/* Curriculum Vitae Upload Section (Matching ProjectMediaEditor)       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Curriculum Vitae</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload a PDF file to replace your live CV across all site links and viewers.
          </p>
        </div>

        <Card className="bg-neutral-900/80 border-neutral-800 p-6 flex flex-col gap-4">
          {/* Drag & Drop Zone */}
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition ${
              uploadingCv
                ? "cursor-wait border-blue-400 bg-blue-500/10"
                : isDragOver
                ? "border-blue-400 bg-blue-500/10"
                : "border-neutral-700 bg-neutral-800/60 hover:border-neutral-500 hover:bg-neutral-800"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileInput}
              className="hidden"
              disabled={uploadingCv}
            />

            {uploadingCv ? (
              <>
                <div className="mb-3 h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-blue-400" />
                <p className="text-sm font-medium text-blue-300">Uploading CV…</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Please wait while the new file is being uploaded
                </p>
              </>
            ) : isDragOver ? (
              <>
                <div className="mb-2 text-xl text-blue-400">↓</div>
                <p className="text-sm font-medium text-blue-300">Drop PDF here</p>
              </>
            ) : (
              <>
                <div className="mb-2 text-xl text-neutral-400">+</div>
                <p className="text-sm font-medium text-neutral-300">
                  Drag CV PDF here, or click to browse
                </p>
                <p className="mt-1 text-xs text-neutral-500">PDF files only</p>
              </>
            )}
          </label>

          {cvMessage && (
            <p
              className={`text-xs p-2.5 rounded border ${
                cvMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-950/50 border-red-800 text-red-400"
              }`}
            >
              {cvMessage.text}
            </p>
          )}

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>
              Live Endpoint: <code className="text-neutral-300 font-mono">/api/media/cv</code>
            </span>
            <a
              href={getCvDownloadUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
            >
              <HiOutlineDocumentDownload size={14} /> Preview Current CV
            </a>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Site Links & Contacts Form                                         */}
      {/* ------------------------------------------------------------------ */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div>
          <h2 className="text-sm font-semibold text-white">Contact & Social Links</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure social profile links and email details.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded text-xs border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <Card className="bg-neutral-900/80 border-neutral-800 p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-300">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="e.g. dylan@example.com"
                className="rounded bg-neutral-800/40 border border-neutral-700/60 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-300">GitHub URL</label>
              <input
                type="text"
                value={settings.githubUrl}
                onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="rounded bg-neutral-800/40 border border-neutral-700/60 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-300">LinkedIn URL</label>
              <input
                type="text"
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="rounded bg-neutral-800/40 border border-neutral-700/60 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-300">Social Badge One</label>
              <input
                type="text"
                value={settings.socialOne}
                onChange={(e) => setSettings({ ...settings, socialOne: e.target.value })}
                placeholder="e.g. Twitter / X"
                className="rounded bg-neutral-800/40 border border-neutral-700/60 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-300">Social Badge Two</label>
              <input
                type="text"
                value={settings.socialTwo}
                onChange={(e) => setSettings({ ...settings, socialTwo: e.target.value })}
                placeholder="e.g. Discord"
                className="rounded bg-neutral-800/40 border border-neutral-700/60 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-neutral-300">Social Badge Three</label>
              <input
                type="text"
                value={settings.socialThree}
                onChange={(e) => setSettings({ ...settings, socialThree: e.target.value })}
                placeholder="e.g. Substack"
                className="rounded bg-neutral-800/40 border border-neutral-700/60 px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-blue-500 hover:bg-blue-400 disabled:opacity-50 px-4 py-2 text-xs font-medium text-white transition shrink-0"
          >
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}