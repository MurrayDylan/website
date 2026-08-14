import {
  type LayoutType,
  type ModuleResponse,
  type TopicResponse,
} from "./responseTypes";

import { type PageBlock } from "../admin/blocks";

export type PageMetadata = Record<string, any>;

export interface ProjectLinkRequest {
  label: string;
  url: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ProjectRequest {
  title: string;
  description: string;
  links: ProjectLinkRequest[];
  technologies: string[];
}

export interface WorkExperienceRequest {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  location?: string | null;
  companyWebsite?: string | null;
  companyLogo?: string | null;
  description?: string | null;
  displayOrder?: number | null;
  technologyIds: number[];
}

export interface TechnologyRequest {
  name: string;
  category: string;
}

export interface MediaAttachmentRequest {
  displayOrder: number;
  caption?: string | null;
  altText?: string | null;
}

export interface ProjectMediaRequest {
  mediaId: number;
  displayOrder: number;
  caption?: string | null;
  altText?: string | null;
}

export interface PageRequest {
  slug: string;
  title: string;
  subtitle?: string | null;
  layoutType: LayoutType;
  content?: string | null;
  metadata?: PageMetadata | null;
  blocks?: PageBlock[] | null;
}

export interface SiteSettingsRequest {
  email?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  socialOne?: string | null;
  socialTwo?: string | null;
  socialThree?: string | null;
}

export interface EducationRequest {
  institution: string;
  location: string;
  qualification: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  displayOrder: number;
  modules?: (Omit<ModuleResponse, "id" | "topics"> & {
    topics?: Omit<TopicResponse, "id">[];
  })[];
}

export interface ReorderRequest {
  ids: number[];
}