import { useState, type FormEvent } from "react";
import { type ProjectRequest, type ProjectLinkRequest } from "../../api/requestTypes";
import { type ProjectResponse, type TechnologyResponse } from "../../api/responseTypes";
import { useAuth } from "../../context/AuthContext";
import ProjectLinkEditor from "./ProjectLinkEditor";
import ProjectMediaEditor, { type StagedMediaItem } from "./ProjectMediaEditor";
import TechnologyPicker from "./TechnologyPicker";

interface ProjectFormProps {
  initialValues?: ProjectResponse;
  onSubmit: (data: ProjectRequest, mediaItems: StagedMediaItem[]) => Promise<void>;
  submitLabel: string;
}

export default function ProjectForm({ initialValues, onSubmit, submitLabel }: ProjectFormProps) {
  const { token } = useAuth();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [links, setLinks] = useState<ProjectLinkRequest[]>(
    initialValues?.links.map((link) => ({
      label: link.label,
      url: link.url,
    })) ?? []
  );
  const [technologies, setTechnologies] = useState<TechnologyResponse[]>(
    initialValues?.technologies ?? []
  );

  // Initialize staged media basket from project response
  const initialMedia = initialValues?.media ?? (initialValues as any)?.projectMedia ?? [];
  const [mediaItems, setMediaItems] = useState<StagedMediaItem[]>(() =>
    initialMedia.map((pm: any) => {
      const mediaObj = pm.media || pm;
      return {
        mediaId: mediaObj.id,
        originalFilename: mediaObj.originalFilename || "Attached File",
        contentType: mediaObj.contentType || "application/octet-stream",
        fileSize: mediaObj.fileSize || 0,
        displayOrder: pm.displayOrder ?? 0,
        caption: pm.caption ?? undefined,
        altText: pm.altText ?? undefined,
        viewUrl: mediaObj.viewUrl,
      };
    })
  );

  const [isMediaUploading, setIsMediaUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(
        {
          title,
          description,
          links,
          technologies: technologies.map((t) => t.name),
        },
        mediaItems
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <ProjectLinkEditor
        links={links}
        onChange={setLinks}
      />

      {token && (
        <ProjectMediaEditor
          mediaItems={mediaItems}
          onChange={setMediaItems}
          token={token}
          onProcessingChange={setIsMediaUploading}
        />
      )}

      {token && (
        <TechnologyPicker
          selected={technologies}
          onChange={setTechnologies}
          token={token}
          showBrowser={false}
        />
      )}

      <button
        type="submit"
        disabled={isSubmitting || isMediaUploading}
        className="rounded-md bg-blue-500 hover:bg-blue-400 disabled:opacity-50 py-2 text-sm font-medium text-white"
      >
        {isMediaUploading
          ? "Uploading Media…"
          : isSubmitting
            ? "Saving…"
            : submitLabel}
      </button>
    </form>
  );
}