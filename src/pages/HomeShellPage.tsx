import { useEffect, useState } from "react";
import { copy } from "@/copy/es-PE";
import { fetchHealth, fetchSeedStats } from "@/lib/api";

export function HomeShellPage() {
  const [health, setHealth] = useState<string | null>(null);
  const [seedLine, setSeedLine] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then((h) => setHealth(`${copy.shell.healthOk} (${h.slice})`))
      .catch(() => setHealth(copy.errors.network));

    fetchSeedStats()
      .then((s) => {
        if (!s.seeded || !s.counts) {
          setSeedLine(`${copy.shell.seedLabel}: pendiente (npm run db:seed)`);
          return;
        }
        setSeedLine(
          `${copy.shell.seedLabel}: ${s.counts.posts} posts · ${s.counts.users} users`,
        );
      })
      .catch(() => setSeedLine(null));
  }, []);

  return (
    <section className="empty-panel">
      <h1 className="empty-panel__title">{copy.shell.emptyHomeTitle}</h1>
      <p className="empty-panel__body">{copy.shell.emptyHomeBody}</p>
      {health ? <p className="empty-panel__meta">{health}</p> : null}
      {seedLine ? <p className="empty-panel__meta">{seedLine}</p> : null}
    </section>
  );
}
