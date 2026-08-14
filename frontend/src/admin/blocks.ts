import { type MarkdownBlockData } from "../components/blocks/MarkdownBlock";
import { type HeroBlockData } from "../components/blocks/HeroBlock";
import { type FeatureGridBlockData } from "../components/blocks/FeatureGridBlock";
import { type CalloutBlockData } from "../components/blocks/CalloutBlock";
import { type CodeBlockData } from "../components/blocks/CodeBlock";
import { type MediaResponse } from "../api/responseTypes";

export type BlockType =
  | "markdown"
  | "hero"
  | "feature_grid"
  | "callout"
  | "code"
  | "media";

export interface BaseBlock {
  id: string; // Client-side UUID for keys & reordering
  type: BlockType;
}

export interface MarkdownBlock extends BaseBlock {
  type: "markdown";
  data: MarkdownBlockData;
}

export interface HeroBlock extends BaseBlock {
  type: "hero";
  data: HeroBlockData;
}

export interface FeatureGridBlock extends BaseBlock {
  type: "feature_grid";
  data: FeatureGridBlockData;
}

export interface CalloutBlock extends BaseBlock {
  type: "callout";
  data: CalloutBlockData;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
  data: CodeBlockData;
}

export interface MediaAttachmentItem {
  id: number | string;
  media: MediaResponse;
  caption?: string;
  altText?: string;
}

export interface MediaBlockData {
  _type: "media";
  items: MediaAttachmentItem[];
}

export interface MediaBlock extends BaseBlock {
  type: "media";
  data: MediaBlockData;
}

export type PageBlock =
  | MarkdownBlock
  | HeroBlock
  | FeatureGridBlock
  | CalloutBlock
  | CodeBlock
  | MediaBlock;