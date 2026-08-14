interface ChipProps {
  label: string;
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
}

export default function Chip({
  label,
  selected = false,
  removable = false,
  onClick,
}: ChipProps) {
  const isInteractive = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`group inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors
        ${isInteractive ? "cursor-pointer" : ""}
        ${
          selected
            ? removable
              ? "bg-blue-500 text-white hover:bg-red-500"
              : "bg-blue-500 text-white"
            : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
        }`}
    >
      {label}
      {removable && (
        <span className="hidden group-hover:inline leading-none">×</span>
      )}
    </span>
  );
}