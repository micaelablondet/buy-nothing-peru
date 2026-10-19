import { categories } from "@/data/catalog";

interface CategoryChipsProps {
  value: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Chip
        label="Todas"
        active={value === null}
        onClick={() => onChange(null)}
      />
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          active={value === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-ink text-white"
          : "bg-surface-elevated text-ink-muted ring-1 ring-border"
      }`}
    >
      {label}
    </button>
  );
}
