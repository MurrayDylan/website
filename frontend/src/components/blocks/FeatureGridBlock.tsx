import FeatureCard from "../shared/FeatureCard";

export interface FeatureItem {
  title: string;
  tag?: string;
  description: string;
  tech?: string[];
  date?: string;
}

export interface FeatureGridBlockData {
  _type: "featureGrid";
  sectionTitle?: string;
  items?: FeatureItem[];
}

export default function FeatureGridBlock({ data }: { data: FeatureGridBlockData }) {
  const items = data.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      {data.sectionTitle && (
        <h2 className="text-xl font-semibold text-white">
          {data.sectionTitle}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-4">
        {items.map((item, idx) => (
          <FeatureCard
            key={item.title || idx}
            title={item.title}
            tag={item.tag ?? "Feature"}
            description={item.description}
            tech={item.tech}
            date={item.date}
          />
        ))}
      </div>
    </div>
  );
}