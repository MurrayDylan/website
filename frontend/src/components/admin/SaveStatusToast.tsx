type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SaveStatusToastProps {
  status: SaveStatus;
}

export default function SaveStatusToast({ status }: SaveStatusToastProps) {
  if (status === "idle") return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-4 z-50 pointer-events-none">
      {status === "saving" && (
        <span className="flex items-center gap-2 rounded-full bg-neutral-900/95 border border-neutral-700 px-5 py-2 text-xs font-medium text-amber-400 shadow-2xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Saving order…
        </span>
      )}
      {status === "saved" && (
        <span className="flex items-center gap-2 rounded-full bg-neutral-900/90 border border-neutral-700 px-5 py-2 text-xs font-medium text-emerald-400 shadow-2xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Order saved
        </span>
      )}
      {status === "error" && (
        <span className="flex items-center gap-2 rounded-full bg-neutral-900/90 border border-neutral-700 px-5 py-2 text-xs font-medium text-red-400 shadow-2xl backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Save failed
        </span>
      )}
    </div>
  );
}