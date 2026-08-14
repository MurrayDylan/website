import { useState, type FormEvent } from "react";
import { type EducationRequest } from "../../api/requestTypes";
import { type EducationResponse } from "../../api/responseTypes";
import ModulePicker, { type DraftModule } from "./ModulePicker";

interface EducationFormProps {
  initialValues?: EducationResponse;
  onSubmit: (data: EducationRequest) => Promise<void>;
  submitLabel: string;
}

export default function EducationForm({ initialValues, onSubmit, submitLabel }: EducationFormProps) {
  const [institution, setInstitution] = useState(initialValues?.institution ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [qualification, setQualification] = useState(initialValues?.qualification ?? "");
  const [fieldOfStudy, setFieldOfStudy] = useState(initialValues?.fieldOfStudy ?? "");
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? "");
  const [current, setCurrent] = useState(initialValues?.current ?? false);
  const [grade, setGrade] = useState(initialValues?.grade ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");

  const [modules, setModules] = useState<DraftModule[]>(
    initialValues?.modules?.map((m) => ({
      name: m.name,
      grade: m.grade ?? undefined,
      description: m.description ?? undefined,
      displayOrder: m.displayOrder,
      topics: m.topics.map((t) => ({ title: t.title, displayOrder: t.displayOrder })),
    })) ?? []
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        institution,
        location,
        qualification,
        fieldOfStudy: fieldOfStudy.trim() || undefined,
        startDate,
        endDate: current ? undefined : endDate.trim() || undefined,
        current,
        grade: grade.trim() || undefined,
        description: description.trim() || undefined,
        displayOrder: initialValues?.displayOrder ?? 0,
        modules: modules.map((mod, index) => ({
          name: mod.name,
          grade: mod.grade?.trim() || undefined,
          description: mod.description?.trim() || undefined,
          displayOrder: index,
          topics: mod.topics.map((t, tIndex) => ({
            title: t.title,
            displayOrder: tIndex,
          })),
        })),
      });
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Institution
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Qualification
          <input
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Field of Study
          <input
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Grade
          <input
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. First Class Honours"
            className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Start Date
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
            />
          </label>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={current}
          onChange={(e) => setCurrent(e.target.checked)}
          className="rounded border-neutral-700 bg-neutral-800"
        />
        I am currently studying here
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-md bg-neutral-800 px-3 py-2 border border-neutral-700 text-white"
        />
      </label>

      <ModulePicker modules={modules} onChange={setModules} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-500 hover:bg-blue-400 disabled:opacity-50 py-2 text-sm font-medium text-white mt-2"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}