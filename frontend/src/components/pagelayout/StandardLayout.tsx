import ReactMarkdown from "react-markdown";
import { type PageResponse } from "../../api/responseTypes";
import MediaViewer from "../shared/MediaViewer";

export default function StandardLayout({ page }: { page: PageResponse }) {
  const sortedMedia = [...(page.media ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  const mediaItems = sortedMedia.map((item) => ({
    id: item.id,
    media: item.media,
    caption: item.caption ?? undefined,
    altText: item.altText ?? undefined,
  }));

  return (
    <article className="flex flex-col flex-1 max-w-3xl mx-auto w-full py-4">
      {page.content && (
        <div className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className="mt-8 mb-6 w-full max-w-2xl mx-auto">
            <MediaViewer items={mediaItems} />
        </div>
      )}
    </article>
  );
}