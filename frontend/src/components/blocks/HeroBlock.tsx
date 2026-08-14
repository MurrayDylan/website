export interface HeroBlockData {
  _type: "hero";
  title: string;
  subtitle?: string;
}

export default function HeroBlock({ data }: { data: HeroBlockData }) {
  return (
    <div className="py-6 border-b border-neutral-800">
      <h1 className="text-3xl font-bold text-white tracking-tight">
        {data.title}
      </h1>
      {data.subtitle && (
        <p className="text-base text-neutral-400 mt-2 leading-relaxed">
          {data.subtitle}
        </p>
      )}
    </div>
  );
}