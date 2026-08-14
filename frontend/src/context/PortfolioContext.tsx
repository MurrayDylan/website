import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import { portfolioReducer, initialPortfolioState, type PortfolioState } from "./portfolioReducer";
import { fetchProjects, fetchWorkExperience , ApiError } from "../api/portfolioApi";

const PortfolioContext = createContext<PortfolioState | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);

  useEffect(() => {
    fetchProjects()
      .then((data) => dispatch({ type: "PROJECTS_SUCCESS", data }))
      .catch((err) => dispatch({ type: "PROJECTS_ERROR", message: err instanceof ApiError ? err.message : "Unknown error" }));

    fetchWorkExperience()
      .then((data) => dispatch({ type: "WORK_SUCCESS", data }))
      .catch((err) => dispatch({ type: "WORK_ERROR", message: err instanceof ApiError ? err.message : "Unknown error" }));
}, []);

  return (
    <PortfolioContext.Provider value={state}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioProvider");
  }
  return context;
}