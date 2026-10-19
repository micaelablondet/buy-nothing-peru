import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { PidoAskVisual } from "@/components/PidoAskVisual";
import { PostTypeBadge } from "@/components/PostTypeBadge";
import { ReportButton } from "@/components/ReportButton";
import {
  buildPidoOfferMessage,
  buildWhatsAppDmLink,
} from "@/lib/whatsapp";
import { usePrototypeStore } from "@/store/prototypeStore";

export function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const posts = usePrototypeStore((s) => s.posts);
  const currentUserId = usePrototypeStore((s) => s.currentUserId);
  const interests = usePrototypeStore((s) => s.interests);
  const chosenRecipient = usePrototypeStore((s) => s.chosenRecipient);
  const expressInterest = usePrototypeStore((s) => s.expressInterest);
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);
  const getCurrentNeighbor = usePrototypeStore((s) => s.getCurrentNeighbor);

  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return (
      <div className="p-4">
        <p>Publicación no encontrada.</p>
        <Link to="/feed" className="font-medium text-emerald-50 underline">
          Volver
        </Link>
      </div>
    );
  }

  const author = getNeighbor(post.authorId);
  const isAuthor = post.authorId === currentUserId;
  const postInterests = interests[post.id] ?? [];
  const chosenId = chosenRecipient[post.id];
  const alreadyInterested = postInterests.includes(currentUserId);
  const isChosenReceiver = chosenId === currentUserId;
  const canCoordinate =
    chosenId &&
    (isAuthor || isChosenReceiver) &&
    post.status === "active";

  const me = getCurrentNeighbor();

  const openPidoWhatsApp = () => {
    if (!author || !me) {
      return;
    }
    if (!alreadyInterested) {
      expressInterest(post.id);
    }
    const href = buildWhatsAppDmLink(
      author.phone,
      buildPidoOfferMessage({
        senderName: me.firstName,
        district: me.district,
        askTitle: post.title,
      }),
    );
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pb-6">
      <div className="flex items-center gap-2 px-4 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-emerald-50"
        >
          ← Volver
        </button>
        <div className="ml-auto">
          <ReportButton context="publicación" />
        </div>
      </div>

      <div
        className={`aspect-[4/3] overflow-hidden ${
          post.type === "pido"
            ? ""
            : "flex items-center justify-center bg-white"
        }`}
      >
        {post.type === "pido" ? (
          <PidoAskVisual variant="hero" />
        ) : post.imageUrls[0] ? (
          <img
            src={post.imageUrls[0]}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        ) : null}
      </div>

      <div className="space-y-4 px-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <PostTypeBadge type={post.type} />
          <span className="text-sm text-ink-muted">{post.district}</span>
          <span className="text-sm text-ink-muted">· {post.category}</span>
        </div>
        <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
        <p className="text-sm leading-relaxed text-ink">{post.description}</p>

        {!isAuthor && post.status === "active" && !chosenId && post.type === "pido" ? (
          <button
            type="button"
            onClick={openPidoWhatsApp}
            className={`w-full rounded-full py-3.5 text-base font-semibold ${
              alreadyInterested
                ? "bg-[#25D366] text-white"
                : "bg-white text-brand ring-2 ring-brand"
            }`}
          >
            {alreadyInterested ? "Seguir por WhatsApp" : "Yo tengo"}
          </button>
        ) : null}

        {author ? (
          isAuthor ? (
            <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-border">
              <Avatar name={author.firstName} color={author.avatarColor} />
              <div>
                <p className="text-sm font-semibold">{author.firstName}</p>
                <p className="text-xs text-ink-muted">en {author.district}</p>
              </div>
            </div>
          ) : (
            <Link
              to={`/vecino/${author.id}`}
              className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-border transition active:scale-[0.99]"
            >
              <Avatar name={author.firstName} color={author.avatarColor} />
              <div>
                <p className="text-sm font-semibold text-ink">
                  {author.firstName}
                </p>
                <p className="text-xs text-ink-muted">en {author.district}</p>
              </div>
              <span className="ml-auto text-xs font-semibold text-brand">
                Ver perfil →
              </span>
            </Link>
          )
        ) : null}

        {post.status === "given" ? (
          <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand">
            Esta publicación ya fue entregada / cerrada.
          </p>
        ) : null}

        {isAuthor && post.status === "active" ? (
          <Link
            to={`/feed/${post.id}/elegir`}
            className={`block w-full rounded-2xl py-3.5 text-center text-base font-semibold ${
              postInterests.length > 0
                ? "bg-brand text-white"
                : "bg-white text-ink-muted ring-1 ring-border"
            }`}
          >
            Elegir receptor
            {postInterests.length > 0
              ? ` (${postInterests.length} interesados)`
              : ""}
          </Link>
        ) : null}

        {!isAuthor && post.status === "active" && !chosenId && post.type !== "pido" ? (
          <button
            type="button"
            disabled={alreadyInterested}
            onClick={() => expressInterest(post.id)}
            className="w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-white disabled:opacity-60"
          >
            {alreadyInterested ? "Interés enviado" : "Me interesa"}
          </button>
        ) : null}

        {!isAuthor && isChosenReceiver && post.type !== "pido" ? (
          <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-ink">
            Te eligieron para esta publicación. Ya puedes coordinar por WhatsApp
            (abajo).
          </p>
        ) : null}

        {canCoordinate && post.type !== "pido" ? (
          <Link
            to={`/feed/${post.id}/coordinar`}
            className="block w-full rounded-2xl bg-[#25D366] py-3.5 text-center text-base font-semibold text-white"
          >
            Ir a coordinar entrega
          </Link>
        ) : null}
      </div>
    </div>
  );
}
