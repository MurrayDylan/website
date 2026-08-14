import { type ProjectResponse, type WorkExperienceResponse } from "../api/responseTypes";

import { type ResourceState } from "../api/portfolioApi";

export interface PortfolioState {
  projects: ResourceState<ProjectResponse[]>;
  about: ResourceState<never>;
  education: ResourceState<never>;
  work: ResourceState<WorkExperienceResponse[]>; // was `never`
  skills: ResourceState<never>;
  dissertation: ResourceState<never>;
  aboutThisWebsite: ResourceState<never>;
  contact: ResourceState<never>;
}

export type PortfolioAction =
  | { type: "PROJECTS_SUCCESS"; data: ProjectResponse[] }
  | { type: "PROJECTS_ERROR"; message: string }
  | { type: "WORK_SUCCESS"; data: WorkExperienceResponse[] }
  | { type: "WORK_ERROR"; message: string };

export const initialPortfolioState: PortfolioState = {
  projects: { status: "loading" },
  about: { status: "not-implemented" },
  education: { status: "not-implemented" },
  work: { status: "loading" }, // was not-implemented
  skills: { status: "not-implemented" },
  dissertation: {status: "not-implemented"},
  aboutThisWebsite: {status: "not-implemented"},
  contact: {status: "not-implemented"},
};

export function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case "PROJECTS_SUCCESS":
      return { ...state, projects: { status: "success", data: action.data } };
    case "PROJECTS_ERROR":
      return { ...state, projects: { status: "error", message: action.message } };
    case "WORK_SUCCESS":
      return { ...state, work: { status: "success", data: action.data } };
    case "WORK_ERROR":
      return { ...state, work: { status: "error", message: action.message } };
  }
}