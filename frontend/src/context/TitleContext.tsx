import { createContext, useContext, useState, type ReactNode } from "react";

interface TitleContextType {
  titleOverride: string | null;
  setTitleOverride: (title: string | null) => void;
  headerAction: ReactNode | null;
  setHeaderAction: (action: ReactNode | null) => void;
}

export const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: ReactNode }) {
  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [headerAction, setHeaderAction] = useState<ReactNode | null>(null);

  return (
    <TitleContext.Provider
      value={{ titleOverride, setTitleOverride, headerAction, setHeaderAction }}
    >
      {children}
    </TitleContext.Provider>
  );
}

export function useTitleOverride() {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitleOverride must be used within a TitleProvider");
  }
  return context;
}