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
      className={`group inline-flex items-center rounded-full font-medium transition-colors
        px-3 py-1 text-sm gap-1.5
        sm:px-3.5 sm:py-1.5 sm:text-sm sm:gap-1.5
        lg:px-4 lg:py-2 lg:text-base lg:gap-2
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