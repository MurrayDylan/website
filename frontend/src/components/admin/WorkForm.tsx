import { useEffect, useState, type FormEvent } from "react";
import { type WorkExperienceRequest } from "../../api/requestTypes";
import {
  type WorkExperienceResponse,
  type TechnologyResponse,
} from "../../api/responseTypes";
import { useAuth } from "../../context/AuthContext";
import TechnologyPicker from "./TechnologyPicker";
import WorkMediaEditor from "./WorkMediaEditor";
import { type StagedMediaItem } from "./ProjectMediaEditor";

interface WorkFormProps {
  initialValues?: WorkExperienceResponse;
  onSubmit: (
    data: WorkExperienceRequest,
    mediaItems: StagedMediaItem[]
  ) => Promise<void>;
  submitLabel: string;
}

export default function WorkForm({
  initialValues,
  onSubmit,
  submitLabel,
}: WorkFormProps) {
  const { token } = useAuth();

  const [companyName, setCompanyName] = useState(
    initialValues?.companyName ?? ""
  );
  const [jobTitle, setJobTitle] = useState(
    initialValues?.jobTitle ?? ""
  );
  const [startDate, setStartDate] = useState(
    initialValues?.startDate ?? ""
  );
  const [endDate, setEndDate] = useState(
    initialValues?.endDate ?? ""
  );
  const [current, setCurrent] = useState(
    initialValues?.current ?? false
  );
  const [location, setLocation] = useState(
    initialValues?.location ?? ""
  );
  const [companyWebsite, setCompanyWebsite] = useState(
    initialValues?.companyWebsite ?? ""
  );
  const [companyLogo, setCompanyLogo] = useState(
    initialValues?.companyLogo ?? ""
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? ""
  );
  const [displayOrder, setDisplayOrder] = useState(
    initialValues?.displayOrder?.toString() ?? ""
  );

  const [technologies, setTechnologies] = useState<
    TechnologyResponse[]
  >(initialValues?.technologies ?? []);

  const [mediaItems, setMediaItems] = useState<
    StagedMediaItem[]
  >(() =>
    (initialValues?.media ?? []).map((wm) => ({
      mediaId: wm.media.id,
      originalFilename:
        wm.media.originalFilename || "Attached File",
      contentType:
        wm.media.contentType ||
        "application/octet-stream",
      fileSize: wm.media.fileSize || 0,
      displayOrder: wm.displayOrder ?? 0,
      caption: wm.caption ?? undefined,
      altText: wm.altText ?? undefined,
      viewUrl: wm.media.viewUrl,
    }))
  );

  const [error, setError] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // Prevent submission while media is still uploading.
  const [isMediaUploading, setIsMediaUploading] =
    useState(false);

  useEffect(() => {
    if (initialValues) {
      setCompanyName(initialValues.companyName ?? "");
      setJobTitle(initialValues.jobTitle ?? "");
      setStartDate(initialValues.startDate ?? "");
      setEndDate(initialValues.endDate ?? "");
      setCurrent(initialValues.current ?? false);
      setLocation(initialValues.location ?? "");
      setCompanyWebsite(
        initialValues.companyWebsite ?? ""
      );
      setCompanyLogo(initialValues.companyLogo ?? "");
      setDescription(initialValues.description ?? "");
      setDisplayOrder(
        initialValues.displayOrder?.toString() ?? ""
      );
      setTechnologies(initialValues.technologies ?? []);

      setMediaItems(
        (initialValues.media ?? []).map((wm) => ({
          mediaId: wm.media.id,
          originalFilename:
            wm.media.originalFilename || "Attached File",
          contentType:
            wm.media.contentType ||
            "application/octet-stream",
          fileSize: wm.media.fileSize || 0,
          displayOrder: wm.displayOrder ?? 0,
          caption: wm.caption ?? undefined,
          altText: wm.altText ?? undefined,
          viewUrl: wm.media.viewUrl,
        }))
      );
    }
  }, [initialValues]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // This should never normally happen because the button is
    // disabled, but keeping the guard here prevents submission
    // if handleSubmit is triggered programmatically.
    if (isMediaUploading) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const data: WorkExperienceRequest = {
      companyName,
      jobTitle,
      startDate,
      endDate: current || endDate === "" ? null : endDate,
      current,
      location: location === "" ? null : location,
      companyWebsite:
        companyWebsite === "" ? null : companyWebsite,
      companyLogo:
        companyLogo === "" ? null : companyLogo,
      description:
        description === "" ? null : description,
      displayOrder:
        displayOrder === "" ? null : Number(displayOrder),
      technologyIds: technologies.map((t) => t.id),
    };

    try {
      await onSubmit(data, mediaItems);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      {error && (
        <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Company Name
        <input
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
          required
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Job Title
        <input
          value={jobTitle}
          onChange={(e) =>
            setJobTitle(e.target.value)
          }
          required
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            required
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
          />
        </label>

        {!current && (
          <label className="flex flex-col gap-1 text-sm">
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
            />
          </label>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={current}
          onChange={(e) =>
            setCurrent(e.target.checked)
          }
          className="rounded bg-neutral-800 border-neutral-700"
        />
        Current Position
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Location
        <input
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Company Website
        <input
          value={companyWebsite}
          onChange={(e) =>
            setCompanyWebsite(e.target.value)
          }
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Company Logo URL
        <input
          value={companyLogo}
          onChange={(e) =>
            setCompanyLogo(e.target.value)
          }
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={5}
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Display Order
        <input
          type="number"
          value={displayOrder}
          onChange={(e) =>
            setDisplayOrder(e.target.value)
          }
          placeholder="Optional"
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      {token && (
        <WorkMediaEditor
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
        />
      )}

      <button
        type="submit"
        disabled={
          isSubmitting || isMediaUploading
        }
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