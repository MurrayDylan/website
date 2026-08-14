import MediaViewer from "../shared/MediaViewer";
import { type MediaBlockData } from "../../admin/blocks";

export interface MediaBlockProps {
  data: MediaBlockData;
}

export default function MediaBlock({ data }: MediaBlockProps) {
  if (!data.items || data.items.length === 0) {
    return null;
  }

  return (
    <div className="w-full my-4">
      <MediaViewer items={data.items} />
    </div>
  );
}