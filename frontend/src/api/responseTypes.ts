import { type PageBlock } from "../admin/blocks";

export interface TechnologyResponse {
  id: number;
  name: string;
  category: string;
}

export interface ProjectLinkResponse {
  id: number;
  label: string;
  url: string;
}

export interface ProjectTechnologyResponse {
  id: number;
  name: string;
}

export interface ProjectMediaResponse {
  id: number;
  displayOrder: number;
  caption: string | null;
  altText: string | null;
  isHorizontal?: boolean;
  media: MediaResponse;
}

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  displayOrder: number;
  technologies: TechnologyResponse[];
  links: ProjectLinkResponse[];
  media?: ProjectMediaResponse[];
}

export interface WorkMediaResponse {
  id: number;
  displayOrder: number;
  caption?: string | null;
  altText?: string | null;
  isHorizontal?: boolean;
  media: MediaResponse;
}

export interface WorkExperienceResponse {
  id: number;
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  location?: string | null;
  companyWebsite?: string | null;
  companyLogo?: string | null;
  description: string;
  displayOrder?: number | null;
  technologies: TechnologyResponse[];
  media: WorkMediaResponse[];
}

export interface ApiValidationError {
  objectName: string;
  field: string;
  rejectedValue: unknown;
  codes: string[];
  arguments: unknown[];
  bindingFailure: boolean;
  code: string;
  defaultMessage: string;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  errors?: ApiValidationError[];
  path?: string;
}

export interface TopicResponse {
  id: number;
  title: string;
  displayOrder: number;
}

export interface ModuleResponse {
  id: number;
  name: string;
  grade?: string;
  description?: string;
  displayOrder: number;
  topics: TopicResponse[];
}

export interface EducationResponse {
  id: number;
  institution: string;
  location: string;
  qualification: string;
  fieldOfStudy?: string;
  startDate: string; // ISO format "YYYY-MM-DD"
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  displayOrder: number;
  modules: ModuleResponse[];
}

export interface MediaResponse {
  id: number;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  sha256Hash: string;
  createdAt: string; // ISO string from Java LocalDateTime
  viewUrl: string;
  downloadUrl: string;
}

export interface MediaHashCheckResponse {
  exists: boolean;
  media: MediaResponse | null;
}

export interface MediaHashResponse {
  exists: boolean;
  mediaId: number | null;
  originalFilename: string | null;
  contentType: string | null;
  fileSize: number | null;
}

export type LayoutType = string;

export interface PageMediaResponse {
  id: number;
  displayOrder: number;
  caption?: string | null;
  altText?: string | null;
  isHorizontal?: boolean;
  media: MediaResponse;
}

export interface PageResponse {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  layoutType: LayoutType;
  content?: string | null;
  metadata?: Record<string, any> | null;
  blocks?: PageBlock[];
  media: PageMediaResponse[];
  updatedAt: string;
}

export interface LayoutTemplateResponse {
  layoutType: LayoutType;
  defaultMetadata?: Record<string, any>;
  defaultContent?: string;
}

export interface SiteSettingsResponse {
  email: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  socialOne: string | null;
  socialTwo: string | null;
  socialThree: string | null;
}

export interface LoginResponse {
  token: string;
}