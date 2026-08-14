import { type PageBlock } from "../../admin/blocks";

import MarkdownBlock from "../blocks/MarkdownBlock";
import HeroBlock from "../blocks/HeroBlock";
import FeatureGridBlock from "../blocks/FeatureGridBlock";
import CalloutBlock from "../blocks/CalloutBlock";
import CodeBlock from "../blocks/CodeBlock";
import MediaBlock from "../blocks/MediaBlock";

interface BlockRendererProps {
  blocks?: PageBlock[] | null;
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-sm text-neutral-500 italic py-4">
        No content has been added to this page layout yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {blocks.map((block) => {
        switch (block.type) {
          case "markdown":
            return (
              <div key={block.id} className="w-full">
                <MarkdownBlock data={block.data} />
              </div>
            );

          case "hero":
            return (
              <div key={block.id} className="w-full">
                <HeroBlock data={block.data} />
              </div>
            );

          case "feature_grid":
            return (
              <div key={block.id} className="w-full">
                <FeatureGridBlock data={block.data} />
              </div>
            );

          case "callout":
            return (
              <div key={block.id} className="w-full">
                <CalloutBlock data={block.data} />
              </div>
            );

          case "code":
            return (
              <div key={block.id} className="w-full">
                <CodeBlock data={block.data} />
              </div>
            );

          case "media":
            return (
              <div key={block.id} className="w-full">
                <MediaBlock data={block.data} />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}