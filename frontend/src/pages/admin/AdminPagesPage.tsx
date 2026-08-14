import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPages, deletePage } from "../../api/portfolioApi";
import { type PageResponse } from "../../api/responseTypes";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import Card from "../../components/shared/Card";

export default function AdminPagesPage() {
  const { token } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();
  const [pages, setPages] = useState<PageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitleOverride("Manage Pages");
    setHeaderAction(
      <Link
        to="/admin/pages/new"
        className="rounded-md bg-blue-500 hover:bg-blue-400 px-3 py-1.5 text-xs font-medium text-white transition"
      >
        + New Page
      </Link>
    );

    loadPages();

    return () => {
      setTitleOverride(null);
      setHeaderAction(null);
    };
  }, [setTitleOverride, setHeaderAction]);

  function loadPages() {
    setLoading(true);
    fetchPages()
      .then(setPages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function handleDelete(slug: string) {
    if (!token || !window.confirm(`Are you sure you want to delete page "/${slug}"?`)) return;
    try {
      await deletePage(slug, token);
      loadPages();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete page");
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading pages…</p>;

  return (
    <div className="flex flex-col gap-3 max-w-3xl">
      {pages.length === 0 && (
        <p className="text-sm text-neutral-500">No pages found. Click "+ New Page" to create one.</p>
      )}

      {pages.map((page) => (
        <Card key={page.slug} className="flex items-center justify-between p-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{page.title}</h3>
              <span className="text-xs font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                /{page.slug}
              </span>
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                {page.layoutType}
              </span>
            </div>
            {page.subtitle && (
              <p className="text-xs text-neutral-400 mt-1">{page.subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={`/admin/pages/${page.slug}/edit`}
              className="text-xs text-blue-400 hover:underline"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(page.slug)}
              className="text-xs text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}