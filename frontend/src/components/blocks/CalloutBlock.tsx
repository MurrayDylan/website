export interface CalloutBlockData {
  _type: "callout";
  variant?: "info" | "warning" | "success" | "quote";
  title?: string;
  message: string;
}

export default function CalloutBlock({ data }: { data: CalloutBlockData }) {
  const variantStyles = {
    info: "border-blue-500/40 bg-blue-500/10 text-blue-200",
    warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    quote: "border-neutral-700 bg-neutral-900/80 text-neutral-300 italic",
  };

  const style = variantStyles[data.variant || "info"];

  return (
    <div className={`p-4 rounded-lg border ${style} text-sm flex flex-col gap-1 w-full`}>
      {data.title && (
        <span className="font-semibold text-white uppercase text-xs tracking-wider font-mono">
          {data.title}
        </span>
      )}
      <p className="leading-relaxed">{data.message}</p>
    </div>
  );
}