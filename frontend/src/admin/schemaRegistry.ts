// Defines the exact starting state of any block you want to add to a page
export const BLOCK_SCHEMAS: Record<string, any> = {
  hero: {
    _type: "hero",
    title: "New Hero Title",
    subtitle: "Hero subtitle goes here",
  },
  featureGrid: {
    _type: "featureGrid",
    sectionTitle: "Notable Features",
    items: [], // The form will handle adding items to this nested array
  },
  markdown: {
    _type: "markdown",
    content: "Write your markdown content here...",
  },
};

// Available options for the dropdown menu
export const BLOCK_OPTIONS = [
  { label: "Hero Section", value: "hero" },
  { label: "Feature Grid", value: "featureGrid" },
  { label: "Markdown Block", value: "markdown" },
];

// Fallback schemas for standard arrays (like the "items" array inside a featureGrid)
export const ARRAY_ITEM_SCHEMAS: Record<string, any> = {
  items: {
    title: "New Feature",
    description: "",
    tech: [],
  },
};