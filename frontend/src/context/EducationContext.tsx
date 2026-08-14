import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type EducationResponse } from "../api/responseTypes";
import { getEducation } from "../api/portfolioApi";

type Status = "idle" | "loading" | "success" | "error";

interface EducationContextType {
  educationState: {
    status: Status;
    data: EducationResponse[];
    error: string | null;
  };
  refreshEducation: () => void;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export function EducationProvider({ children }: { children: ReactNode }) {
  const [educationState, setEducationState] = useState<{
    status: Status;
    data: EducationResponse[];
    error: string | null;
  }>({
    status: "idle",
    data: [],
    error: null,
  });

  const fetchEducationData = async () => {
    setEducationState({ status: "loading", data: [], error: null });
    try {
      const data = await getEducation();
      // Sort root items by display order
      const sortedData = [...data].sort((a, b) => a.displayOrder - b.displayOrder);
      setEducationState({ status: "success", data: sortedData, error: null });
    } catch (err: any) {
      setEducationState({ status: "error", data: [], error: err.message });
    }
  };

  useEffect(() => {
    fetchEducationData();
  }, []);

  return (
    <EducationContext.Provider value={{ educationState, refreshEducation: fetchEducationData }}>
      {children}
    </EducationContext.Provider>
  );
}

export function useEducationData() {
  const context = useContext(EducationContext);
  if (!context) {
    throw new Error("useEducationData must be used within an EducationProvider");
  }
  return context;
}