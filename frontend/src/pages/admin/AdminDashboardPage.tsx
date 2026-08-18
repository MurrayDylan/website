import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPages, deletePage } from "../../api/portfolioApi";
import { type PageResponse } from "../../api/responseTypes";
import { useAuth } from "../../context/AuthContext";
import { useTitleOverride } from "../../context/TitleContext";
import Card from "../../components/shared/Card";

const CORE_PAGE_SLUGS = [
  { slug: "about", label: "About Me", defaultLayout: "ABOUT" },
  {
    slug: "dissertation",
    label: "Master's Dissertation",
    defaultLayout: "DISSERTATION",
  },
  { slug: "skills", label: "Skills", defaultLayout: "SKILLS" },
  { slug: "contact", label: "Contact", defaultLayout: "CONTACT" },
  {
    slug: "about-this-website",
    label: "readme.md (About Site)",
    defaultLayout: "ABOUT_THIS_SITE",
  },
];

const ENTITY_MANAGERS = [
  {
    label: "Projects",
    path: "/admin/projects",
    desc: "Manage portfolio project cards, links, and media",
  },
  {
    label: "Work Experience",
    path: "/admin/work",
    desc: "Manage career timeline entries and company attachments",
  },
  {
    label: "Education",
    path: "/admin/education",
    desc: "Manage academic qualifications and course history",
  },
  {
    label: "Technologies & Skills",
    path: "/admin/technologies",
    desc: "Manage skills, names, and categories",
  },
  {
    label: "Layout Presets",
    path: "/admin/layout-templates",
    desc: "Configure pre-baked JSON metadata & starter text for layout types",
  },
];

export default function AdminHubPage() {
  const { token, logout } = useAuth();
  const { setTitleOverride, setHeaderAction } = useTitleOverride();

  const [pages, setPages] = useState<PageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitleOverride("Admin Dashboard");

    setHeaderAction(
      <div className="flex items-center gap-4">
        <Link
          to="/admin/settings"
          className="text-sm text-neutral-400 hover:text-white transition flex items-center gap-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Settings
        </Link>

        <button
          onClick={logout}
          className="text-sm text-neutral-400 hover:text-white transition"
        >
          Log out
        </button>
      </div>
    );

    loadPages();

    return () => setHeaderAction(null);
  }, [logout, setHeaderAction, setTitleOverride]);

  function loadPages() {
    setLoading(true);

    fetchPages()
      .then(setPages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  async function handleDelete(slug: string) {
    if (
      !token ||
      !window.confirm(
        `Are you sure you want to delete the dynamic page "/${slug}"?`
      )
    ) {
      return;
    }

    try {
      await deletePage(slug, token);
      loadPages();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete page"
      );
    }
  }

  const coreSlugsSet = new Set(
    CORE_PAGE_SLUGS.map((c) => c.slug)
  );

  const pageMap = new Map(
    pages.map((p) => [p.slug, p])
  );

  const customPages = pages.filter(
    (p) => !coreSlugsSet.has(p.slug)
  );

  return (
    <div className="flex flex-col gap-8 pb-8">
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Core Resource Managers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENTITY_MANAGERS.map((section) => (
            <Link
              key={section.path}
              to={section.path}
            >
              <Card className="hover:ring-1 hover:ring-blue-400/50 transition cursor-pointer p-4 flex flex-col justify-between h-full bg-neutral-900/80 border-neutral-800">
                <div>
                  <h3 className="font-semibold text-white">
                    {section.label}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1">
                    {section.desc}
                  </p>
                </div>

                <span className="text-xs font-medium text-blue-400 mt-4 block">
                  Manage →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Core Site Pages
            </h2>

            <p className="text-xs text-neutral-400">
              Manage Markdown content, metadata, and media for standard navigation pages
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-neutral-500 py-2">
            Loading core pages…
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CORE_PAGE_SLUGS.map((core) => {
              const existingPage = pageMap.get(
                core.slug
              );

              return (
                <div
                  key={core.slug}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white truncate">
                        {existingPage?.title ||
                          core.label}
                      </h3>

                      <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded shrink-0">
                        /{core.slug}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 truncate mt-1">
                      {existingPage
                        ? `Layout: ${existingPage.layoutType}`
                        : "Not initialized in database yet"}
                    </p>
                  </div>

                  {existingPage ? (
                    <Link
                      to={`/admin/pages/${core.slug}/edit`}
                      className="text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-1.5 rounded transition shrink-0"
                    >
                      Edit Page
                    </Link>
                  ) : (
                    <Link
                      to={`/admin/pages/new?slug=${core.slug}&layout=${core.defaultLayout}&title=${encodeURIComponent(
                        core.label
                      )}`}
                      className="text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded transition shrink-0"
                    >
                      + Create
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Dynamic / Custom Pages
            </h2>

            <p className="text-xs text-neutral-400">
              Custom landing pages or research notes created outside standard navigation
            </p>
          </div>

          <Link
            to="/admin/pages/new"
            className="rounded bg-blue-500 hover:bg-blue-400 px-3 py-1 text-xs font-medium text-white transition shrink-0"
          >
            + New Dynamic Page
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-neutral-500 py-2">
            Loading dynamic pages…
          </p>
        ) : customPages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 p-6 text-center text-xs text-neutral-500">
            No dynamic pages created yet. Click "+ New Dynamic Page" to add custom routes.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {customPages.map((page) => (
              <div
                key={page.slug}
                className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-3.5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white truncate">
                      {page.title}
                    </h3>

                    <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded shrink-0">
                      /{page.slug}
                    </span>

                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded shrink-0">
                      {page.layoutType}
                    </span>
                  </div>

                  {page.subtitle && (
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {page.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/admin/pages/${page.slug}/edit`}
                    className="text-xs text-neutral-300 hover:text-white transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(page.slug)
                    }
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}