import { AskBubbleIcon } from "@/components/NavIcons";

/** Photo thumbnail or Pedido empty speech-bubble placeholder. */
export function FeedCardPhoto({
  url,
  emptyAsk,
}: {
  url?: string | null;
  emptyAsk?: boolean;
}) {
  if (url) {
    return <img className="feed-card__img" src={url} alt="" />;
  }
  return (
    <div
      className="feed-card__img feed-card__img--empty"
      data-testid={emptyAsk ? "pedido-empty-icon" : undefined}
    >
      {emptyAsk ? <AskBubbleIcon className="feed-card__empty-icon" /> : null}
    </div>
  );
}
