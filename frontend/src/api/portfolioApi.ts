import {
  type ProjectResponse,
  type WorkExperienceResponse,
  type TechnologyResponse,
  type ApiErrorResponse,
  type MediaResponse,
  type PageResponse,
  type LayoutTemplateResponse,
  type LayoutType,
  type SiteSettingsResponse,
  type EducationResponse,
  type LoginResponse,
} from "./responseTypes";

import {
  type ProjectRequest,
  type WorkExperienceRequest,
  type TechnologyRequest,
  type MediaAttachmentRequest,
  type PageRequest,
  type SiteSettingsRequest,
  type EducationRequest,
  type ReorderRequest,
  type LoginRequest,
} from "./requestTypes";

const BASE_URL = "/api";

export type ResourceState<T> =
  | { status: "loading" }
  | { status: "not-implemented" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };


export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getApiErrorMessage(
  errorBody: ApiErrorResponse | null,
  status: number
): string {
  const validationMessage = errorBody?.errors
    ?.map((error) => error.defaultMessage)
    .filter(Boolean)
    .join(", ");

  return (
    validationMessage ||
    errorBody?.message ||
    `Request failed (${status})`
  );
}

async function sendJson<T>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  token: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    const errorBody: ApiErrorResponse | null = await res
      .json()
      .catch(() => null);

    throw new ApiError(
      getApiErrorMessage(errorBody, res.status),
      res.status
    );
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

async function sendFormData<T>(
  path: string,
  method: "POST" | "PUT",
  token: string,
  body: FormData
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  if (res.status === 401) {
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    const errorBody: ApiErrorResponse | null = await res
      .json()
      .catch(() => null);

    throw new ApiError(
      getApiErrorMessage(errorBody, res.status),
      res.status
    );
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

async function getJson<T>(
  path: string,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  if (res.status === 401) {
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    const errorBody: ApiErrorResponse | null = await res
      .json()
      .catch(() => null);

    throw new ApiError(
      getApiErrorMessage(errorBody, res.status),
      res.status
    );
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// URL Utility Helpers
// ---------------------------------------------------------------------------

export function resolveMediaUrl(
  url: string | undefined | null,
  mediaId: number,
  type: "view" | "download" = "view"
): string {
  if (!url) {
    return `${BASE_URL}/media/${mediaId}/${type}`;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
}

export function getMediaViewUrl(mediaId: number): string {
  return `${BASE_URL}/media/${mediaId}/view`;
}

export function getMediaDownloadUrl(mediaId: number): string {
  return `${BASE_URL}/media/${mediaId}/download`;
}

// ---------------------------------------------------------------------------
// Projects API
// ---------------------------------------------------------------------------

export function createProject(
  data: ProjectRequest,
  token: string
) {
  return sendJson<ProjectResponse>(
    "/projects",
    "POST",
    token,
    data
  );
}

export function updateProject(
  id: number,
  data: ProjectRequest,
  token: string
) {
  return sendJson<ProjectResponse>(
    `/projects/${id}`,
    "PUT",
    token,
    data
  );
}

export function reorderProjects(
  data: ReorderRequest,
  token: string
) {
  return sendJson<void>("/projects/reorder", "PUT", token, data);
}

export function deleteProject(
  id: number,
  token: string
) {
  return sendJson<void>(
    `/projects/${id}`,
    "DELETE",
    token
  );
}

export function fetchProjects() {
  return getJson<ProjectResponse[]>("/projects");
}

export function fetchProjectById(id: number) {
  return getJson<ProjectResponse>(`/projects/${id}`);
}

// ---------------------------------------------------------------------------
// Work Experience API
// ---------------------------------------------------------------------------

export function fetchWorkExperience() {
  return getJson<WorkExperienceResponse[]>("/work");
}

export function fetchWorkExperienceById(id: number) {
  return getJson<WorkExperienceResponse>(`/work/${id}`);
}

export function createWorkExperience(
  data: WorkExperienceRequest,
  token: string
) {
  return sendJson<WorkExperienceResponse>(
    "/work",
    "POST",
    token,
    data
  );
}

export function updateWorkExperience(
  id: number,
  data: WorkExperienceRequest,
  token: string
) {
  return sendJson<WorkExperienceResponse>(
    `/work/${id}`,
    "PUT",
    token,
    data
  );
}

export function reorderWorkExperience(
  data: ReorderRequest,
  token: string
) {
  return sendJson<void>("/work/reorder", "PUT", token, data);
}

export function deleteWorkExperience(
  id: number,
  token: string
) {
  return sendJson<void>(
    `/work/${id}`,
    "DELETE",
    token
  );
}

// ---------------------------------------------------------------------------
// Technologies API
// ---------------------------------------------------------------------------

export function fetchTechnologies() {
  return getJson<TechnologyResponse[]>("/technologies");
}

export function createTechnology(
  data: TechnologyRequest,
  token: string
) {
  return sendJson<TechnologyResponse>(
    "/technologies",
    "POST",
    token,
    data
  );
}

export function updateTechnology(
  id: number,
  data: TechnologyRequest,
  token: string
) {
  return sendJson<TechnologyResponse>(
    `/technologies/${id}`,
    "PUT",
    token,
    data
  );
}

export function deleteTechnology(
  id: number,
  token: string
) {
  return sendJson<void>(
    `/technologies/${id}`,
    "DELETE",
    token
  );
}

// ---------------------------------------------------------------------------
// Media Controller API
// ---------------------------------------------------------------------------

export async function checkMediaHash(sha256Hash: string): Promise<MediaResponse | null> {
  const res = await fetch(`${BASE_URL}/media/hash/${sha256Hash}`);
  
  if (res.status === 404) {
    return null;
  }
  
  if (!res.ok) {
    throw new ApiError(`Failed to check media hash (${res.status})`, res.status);
  }

  return res.json();
}

export function uploadMedia(file: File, sha256Hash: string, token: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sha256Hash", sha256Hash);

  return sendFormData<MediaResponse>("/media", "POST", token, formData);
}

export function deleteMedia(mediaId: number, token: string) {
  return sendJson<void>(`/media/${mediaId}`, "DELETE", token);
}

// ---------------------------------------------------------------------------
// Media Attachment Controller API
// ---------------------------------------------------------------------------

// Project Attachments
export function attachMediaToProject(
  projectId: number,
  mediaId: number,
  data: MediaAttachmentRequest,
  token: string
) {
  return sendJson<void>(
    `/projects/${projectId}/media/${mediaId}`,
    "POST",
    token,
    data
  );
}

export function updateProjectMedia(
  projectId: number,
  mediaId: number,
  data: MediaAttachmentRequest,
  token: string
) {
  return sendJson<void>(
    `/projects/${projectId}/media/${mediaId}`,
    "PUT",
    token,
    data
  );
}

export function removeMediaFromProject(
  projectId: number,
  mediaId: number,
  token: string
) {
  return sendJson<void>(
    `/projects/${projectId}/media/${mediaId}`,
    "DELETE",
    token
  );
}

// Work Attachments
export function attachMediaToWork(
  workId: number,
  mediaId: number,
  data: MediaAttachmentRequest,
  token: string
) {
  return sendJson<void>(
    `/work/${workId}/media/${mediaId}`,
    "POST",
    token,
    data
  );
}

export function updateWorkMedia(
  workId: number,
  mediaId: number,
  data: MediaAttachmentRequest,
  token: string
) {
  return sendJson<void>(
    `/work/${workId}/media/${mediaId}`,
    "PUT",
    token,
    data
  );
}

export function removeMediaFromWork(
  workId: number,
  mediaId: number,
  token: string
) {
  return sendJson<void>(
    `/work/${workId}/media/${mediaId}`,
    "DELETE",
    token
  );
}

// Page Attachments
export function attachMediaToPage(
  slug: string,
  mediaId: number,
  data: MediaAttachmentRequest,
  token: string
) {
  return sendJson<PageResponse>(
    `/pages/${slug}/media/${mediaId}`,
    "POST",
    token,
    data
  );
}

export function updatePageMedia(
  slug: string,
  mediaId: number,
  data: MediaAttachmentRequest,
  token: string
) {
  return sendJson<PageResponse>(
    `/pages/${slug}/media/${mediaId}`,
    "PUT",
    token,
    data
  );
}

export function removeMediaFromPage(
  slug: string,
  mediaId: number,
  token: string
) {
  return sendJson<void>(
    `/pages/${slug}/media/${mediaId}`,
    "DELETE",
    token
  );
}

export function fetchPages() {
  return getJson<PageResponse[]>("/pages");
}

export function fetchPageBySlug(slug: string) {
  return getJson<PageResponse>(`/pages/${slug}`);
}

export function createPage(data: PageRequest, token: string) {
  return sendJson<PageResponse>("/pages", "POST", token, data);
}

export function updatePage(slug: string, data: PageRequest, token: string) {
  return sendJson<PageResponse>(`/pages/${slug}`, "PUT", token, data);
}

export function deletePage(slug: string, token: string) {
  return sendJson<void>(`/pages/${slug}`, "DELETE", token);
}

export function fetchLayoutTemplates() {
  return getJson<LayoutTemplateResponse[]>("/layout-templates");
}

export function updateLayoutTemplate(
  layoutType: LayoutType,
  data: { defaultMetadata?: Record<string, any>; defaultContent?: string },
  token: string
) {
  return sendJson<LayoutTemplateResponse>(
    `/layout-templates/${layoutType}`,
    "PUT",
    token,
    data
  );
}

export function createLayoutTemplate(
  data: { layoutType: string; defaultMetadata?: Record<string, any>; defaultContent?: string },
  token: string
) {
  return sendJson<LayoutTemplateResponse>(
    "/layout-templates",
    "POST",
    token,
    data
  );
}

export function deleteLayoutTemplate(layoutType: string, token: string) {
  return sendJson<void>(
    `/layout-templates/${layoutType}`,
    "DELETE",
    token
  );
}

export function fetchSiteSettings() {
  return getJson<SiteSettingsResponse>("/settings");
}

export function updateSiteSettings(data: SiteSettingsRequest, token: string) {
  return sendJson<SiteSettingsResponse>("/settings", "PUT", token, data);
}

// ---------------------------------------------------------------------------
// Education API
// ---------------------------------------------------------------------------

export function getEducation() {
  return getJson<EducationResponse[]>("/education");
}

export function getEducationById(id: number) {
  return getJson<EducationResponse>(`/education/${id}`);
}

export function createEducation(
  data: EducationRequest,
  token: string
) {
  return sendJson<EducationResponse>(
    "/education",
    "POST",
    token,
    data
  );
}

export function updateEducation(
  id: number,
  data: EducationRequest,
  token: string
) {
  return sendJson<EducationResponse>(
    `/education/${id}`,
    "PUT",
    token,
    data
  );
}

export function reorderEducation(
  data: ReorderRequest,
  token: string
) {
  return sendJson<void>("/education/reorder", "PUT", token, data);
}

export function deleteEducation(
  id: number,
  token: string
) {
  return sendJson<void>(
    `/education/${id}`,
    "DELETE",
    token
  );
}

export function getCvDownloadUrl(): string {
  return `${BASE_URL}/media/cv`;
}

export function getCvViewUrl(): string {
  return `${BASE_URL}/media/cv`;
}

export async function uploadCv(file: File, token: string): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/media/cv`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload CV (${res.status})`);
  }
}

//built for mediaviewer of cv
export function createCvMediaItem(caption = "Curriculum Vitae") {
  return {
    id: "static-cv-attachment",
    media: {
      id: 0,
      originalFilename: "Dylan_Murray_CV.pdf",
      contentType: "application/pdf",
      viewUrl: `${BASE_URL}/media/cv`,
      downloadUrl: `${BASE_URL}/media/cv`,
      sha256Hash: "",
      fileSize: 0,
      createdAt: new Date().toISOString(),
    },
    caption,
    altText: "Dylan Murray CV",
  };
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => null);
    throw new Error(body?.message ?? "Login failed");
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Forward Compatibility Utilities
// ---------------------------------------------------------------------------

export async function resolveTechnologyId(
  name: string,
  category: string,
  token: string
): Promise<number> {
  const existing = await fetchTechnologies();
  const match = existing.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
  if (match) return match.id;

  const created = await createTechnology({ name, category }, token);
  return created.id;
}