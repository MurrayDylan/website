import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ContentPanel from "./ContentPanel";

export default function AppShell() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const location = useLocation();

  // Track aspect ratio (e.g., landscape vs portrait/narrow)
  const [isWideAspect, setIsWideAspect] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth / window.innerHeight >= 4 / 5;
  });

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth / window.innerHeight >= 4 / 5;
      setIsWideAspect(wide);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset mobile sidebar view on route change
  useEffect(() => {
    setShowMobileSidebar(false);
  }, [location.pathname]);

  return (
    // Changed from p-4 md:p-6 to a consistent p-4 (or p-5) to prevent padding snapping
    <div className="relative h-screen w-screen bg-[url('/background.jpg')] bg-cover bg-center overflow-hidden p-4 box-border flex">
      <div className="flex h-full w-full gap-4 relative">
        
        {/* Desktop Sidebar */}
        {isWideAspect && (
          <div className="flex h-full shrink-0">
            <Sidebar className="w-64" />
          </div>
        )}

        {/* Mobile Sidebar View: Full-screen overlay when toggled on narrow aspect ratios */}
        {!isWideAspect && showMobileSidebar && (
          <div className="flex w-full h-full absolute inset-0 z-30 bg-neutral-950/95 backdrop-blur-md">
            <Sidebar className="w-full" onClose={() => setShowMobileSidebar(false)} />
          </div>
        )}

        {/* Content Panel View */}
        <div className={`flex-1 w-0 min-w-0 h-full flex ${!isWideAspect && showMobileSidebar ? 'hidden' : 'flex'}`}>
          <ContentPanel onOpenMobileMenu={() => setShowMobileSidebar(true)} />
        </div>

      </div>
    </div>
  );
}