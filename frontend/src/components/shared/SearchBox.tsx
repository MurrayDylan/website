interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder = "Search…" }: SearchBoxProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md bg-neutral-800 px-3 py-2 text-sm text-neutral-100
                 placeholder-neutral-500 border border-neutral-700
                 focus:outline-none focus:border-blue-400"
    />
  );
}