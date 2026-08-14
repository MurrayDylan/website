import ReactMarkdown from "react-markdown";

export interface MarkdownBlockData {
  _type: "markdown";
  content: string;
}

export default function MarkdownBlock({ data }: { data: MarkdownBlockData }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed">
      <ReactMarkdown>{data.content}</ReactMarkdown>
    </div>
  );
}