export function PlaceholderPage({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="empty-panel">
      <h1 className="empty-panel__title">{title}</h1>
      <p className="empty-panel__body">{body}</p>
    </section>
  );
}
