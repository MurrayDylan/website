import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ContentPanel from "./ContentPanel";

export type LayoutMode = "desktop" | "mobile";

function getLayoutMode(): LayoutMode {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const aspectRatio = window.innerWidth / window.innerHeight;

  return aspectRatio >= 4 / 5 ? "desktop" : "mobile";
}

export default function AppShell() {
  const location = useLocation();

  const [layoutMode, setLayoutMode] = useState<LayoutMode>(
    getLayoutMode()
  );

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newLayoutMode = getLayoutMode();

      setLayoutMode((currentMode) => {
        if (currentMode !== newLayoutMode) {
          setShowMobileMenu(false);
        }

        return newLayoutMode;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const isMobile = layoutMode === "mobile";

  return (
    <div
      className={`relative h-[100dvh] w-screen bg-[url("/background.jpg")] bg-cover bg-center overflow-hidden box-border flex ${
        isMobile ? "p-0" : "p-4"
      }`}
    >
      <div className="relative flex h-full w-full gap-5">
        {!isMobile && (
          <div className="flex h-full shrink-0">
            <Sidebar className="w-86" />
          </div>
        )}

        <div className="h-full min-w-0 flex-1 flex">
          <ContentPanel
            layoutMode={layoutMode}
            showMobileMenu={showMobileMenu}
            onOpenMobileMenu={() => setShowMobileMenu(true)}
            onCloseMobileMenu={() => setShowMobileMenu(false)}
          />
        </div>
      </div>
    </div>
  );
}