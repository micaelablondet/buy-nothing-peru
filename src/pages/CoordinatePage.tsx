import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import {
  buildHandoffMessage,
  buildWhatsAppDmLink,
} from "@/lib/whatsapp";
import { usePrototypeStore } from "@/store/prototypeStore";

export function CoordinatePage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const posts = usePrototypeStore((s) => s.posts);
  const chosenRecipient = usePrototypeStore((s) => s.chosenRecipient);
  const currentUserId = usePrototypeStore((s) => s.currentUserId);
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);
  const getCurrentNeighbor = usePrototypeStore((s) => s.getCurrentNeighbor);
  const markGiven = usePrototypeStore((s) => s.markGiven);

  const [showGivenPrompt, setShowGivenPrompt] = useState(true);

  const post = posts.find((p) => p.id === postId);
  const chosenId = postId ? chosenRecipient[postId] : undefined;

  if (!post || !chosenId) {
    return (
      <div className="p-4 text-sm">
        <p>Primero elige a un vecino interesado.</p>
        <button
          type="button"
          className="mt-2 font-medium text-emerald-50 underline"
          onClick={() => navigate(`/feed/${postId}`)}
        >
          Volver a la publicación
        </button>
      </div>
    );
  }

  const isAuthor = post.authorId === currentUserId;
  const isReceiver = chosenId === currentUserId;
  if (!isAuthor && !isReceiver) {
    return (
      <div className="p-4 text-sm">
        <p>Solo el vecino que publicó y la persona elegida pueden coordinar aquí.</p>
      </div>
    );
  }

  const me = getCurrentNeighbor();
  const other = getNeighbor(isAuthor ? chosenId : post.authorId);
  if (!me || !other) {
    return null;
  }

  const message = buildHandoffMessage({
    senderName: me.firstName,
    itemTitle: post.title,
    district: me.district,
  });
  const waHref = buildWhatsAppDmLink(other.phone, message);

  return (
    <div className="space-y-5 px-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(`/feed/${post.id}`)}
        className="text-sm font-semibold text-emerald-50"
      >
        ← Volver
      </button>

      <h1 className="text-xl font-bold">Coordinar entrega</h1>
      <p className="text-sm text-ink-muted">
        Ahora sí compartimos el WhatsApp de{" "}
        <strong>{other.firstName}</strong> para que cuadren día y lugar.
      </p>

      <div className="rounded-2xl bg-white p-4 text-sm ring-1 ring-border">
        <p className="font-semibold">{post.title}</p>
        <p className="mt-2 text-ink-muted">
          Sugerencias: portero, lugar público o porche — lo que les quede
          cómodo.
        </p>
      </div>

      <WhatsAppButton href={waHref} />

      {isAuthor && post.status === "active" && showGivenPrompt ? (
        <div className="rounded-2xl bg-brand-soft p-4">
          <p className="text-sm font-medium text-ink">
            ¿Ya entregaste <strong>{post.title}</strong>?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white"
              onClick={() => {
                markGiven(post.id);
                setShowGivenPrompt(false);
                navigate("/feed");
              }}
            >
              Sí, entregado
            </button>
            <button
              type="button"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-muted"
              onClick={() => setShowGivenPrompt(false)}
            >
              Todavía no
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
