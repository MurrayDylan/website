import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTitleOverride } from "../../context/TitleContext";

export default function AdminPlaceholderPage() {
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  useEffect(() => {
    setTitleOverride(null);
    setHeaderAction(
      <Link to="/admin" className="text-sm text-neutral-400 hover:text-white">
        ← Dashboard
      </Link>
    );
    return () => setHeaderAction(null);
  }, [setHeaderAction, setTitleOverride]);

  return <p className="text-neutral-400">Management for this section is coming soon.</p>;
}