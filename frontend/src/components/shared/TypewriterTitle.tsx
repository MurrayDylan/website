import { useTypewriter } from "../../hooks/useTypewriter";

export default function TypewriterTitle({ text }: { text: string }) {
  // Replace every "/" with "/" followed by a zero-width space (\u200B)
  const formattedText = text.replace(/\//g, "/\u200B");
  const displayText = useTypewriter(formattedText);

  return (
    <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 leading-tight min-w-0 w-full overflow-hidden text-ellipsis whitespace-nowrap">
      <span>
        {displayText}
        <span className="inline-block w-[2px] h-4 sm:h-5 bg-blue-400 animate-pulse align-middle ml-1 shrink-0" />
      </span>
    </h2>
  );
}