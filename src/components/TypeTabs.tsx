import { PROTOTYPE_POST_TYPES } from "@/lib/brand";
import { feedTypeTabLabels } from "@/lib/postLabels";
import type { PostType } from "@/lib/types";

interface TypeTabsProps {
  value: PostType;
  onChange: (type: PostType) => void;
}

export function TypeTabs({ value, onChange }: TypeTabsProps) {
  if (PROTOTYPE_POST_TYPES.length <= 1) {
    return null;
  }

  return (
    <div className="flex gap-2" role="tablist" aria-label="Tipo de publicación">
      {PROTOTYPE_POST_TYPES.map((type) => {
        const active = value === type;
        return (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(type)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
              active
                ? "bg-brand text-white shadow-sm"
                : "bg-surface-elevated text-ink-muted ring-1 ring-border"
            }`}
          >
            {feedTypeTabLabels[type]}
          </button>
        );
      })}
    </div>
  );
}
