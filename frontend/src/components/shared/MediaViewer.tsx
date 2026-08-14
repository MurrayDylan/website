import PdfViewer from "./PdfViewer";
import ChartCarousel from "../media/ChartCarousel";
import { type MediaResponse } from "../../api/responseTypes";
import { resolveMediaUrl } from "../../api/portfolioApi";

interface MediaAttachmentItem {
  id: number | string;
  media: MediaResponse;
  caption?: string;
  altText?: string;
}

interface MediaViewerProps {
  items?: MediaAttachmentItem[];
}

export default function MediaViewer({ items = [] }: MediaViewerProps) {
  const safeItems = items ?? [];

  const imageItems = safeItems.filter((item) => item?.media?.contentType?.startsWith("image/"));
  const otherItems = safeItems.filter((item) => !item?.media?.contentType?.startsWith("image/"));

  const galleryImages = imageItems.map((item) => ({
    id: item.id,
    viewUrl: resolveMediaUrl(item.media.viewUrl, item.media.id, "view"),
    downloadUrl: resolveMediaUrl(item.media.downloadUrl, item.media.id, "download"),
    altText: item.altText || item.media.originalFilename,
    caption: item.caption,
  }));

  return (
    <div className="flex flex-col gap-6 w-full">
      {galleryImages.length > 0 && <ChartCarousel images={galleryImages} />}

      {otherItems.map((item) => {
        const resolvedViewUrl = resolveMediaUrl(item.media.viewUrl, item.media.id, "view");
        const resolvedDownloadUrl = resolveMediaUrl(item.media.downloadUrl, item.media.id, "download");

        if (item.media.contentType === "application/pdf") {
          return (
            <PdfViewer
              key={item.id}
              viewUrl={resolvedViewUrl}
              downloadUrl={resolvedDownloadUrl}
              title={item.caption || item.media.originalFilename}
            />
          );
        }

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-md border border-neutral-700 bg-neutral-800 w-full"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300 uppercase">
                {item.media.contentType.split("/")[1] || "FILE"}
              </span>
              <span className="text-sm font-medium text-white truncate">{item.media.originalFilename}</span>
            </div>
            <a
              href={resolvedDownloadUrl}
              download
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Download File
            </a>
          </div>
        );
      })}
    </div>
  );
}