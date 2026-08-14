import { resolveMediaUrl } from "../../api/portfolioApi";
import { type MediaResponse } from "../../api/responseTypes";

interface AvatarProps {
  media: MediaResponse;
  altText?: string;
  className?: string;
}

export default function Avatar({ media, altText, className }: AvatarProps) {
  const viewUrl = resolveMediaUrl(media.viewUrl, media.id, "view");

  return (
    <div className={className ?? "w-24 h-24 rounded-full overflow-hidden border border-neutral-700 shrink-0"}>
      <img src={viewUrl} alt={altText || "Profile Picture"} className="w-full h-full object-cover" />
    </div>
  );
}