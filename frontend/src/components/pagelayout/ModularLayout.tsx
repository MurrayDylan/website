import { type PageResponse } from "../../api/responseTypes";
import BlockRenderer from "../shared/BlockRenderer";

interface ModularLayoutProps {
  page: PageResponse;
}

export default function ModularLayout({ page }: ModularLayoutProps) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Page Header */}
      <header className="flex flex-col gap-2 border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-neutral-400 text-sm">
            {page.subtitle}
          </p>
        )}
      </header>

      {/* Render Dynamic Canvas Elements */}
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}