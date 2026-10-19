import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { usePrototypeStore } from "@/store/prototypeStore";

export function ChooseRecipientPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const posts = usePrototypeStore((s) => s.posts);
  const interests = usePrototypeStore((s) => s.interests);
  const chooseRecipient = usePrototypeStore((s) => s.chooseRecipient);
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);
  const currentUserId = usePrototypeStore((s) => s.currentUserId);

  const post = posts.find((p) => p.id === postId);
  if (!post || post.authorId !== currentUserId) {
    return (
      <div className="space-y-3 p-4 text-sm">
        <p>Solo quien publicó puede elegir receptor.</p>
        <button
          type="button"
          className="text-brand underline"
          onClick={() => navigate("/feed")}
        >
          Ir al feed
        </button>
      </div>
    );
  }

  const interestedIds = interests[post.id] ?? [];

  return (
    <div className="space-y-4 px-4 pb-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm font-medium text-brand"
      >
        ← Volver
      </button>
      <h1 className="text-xl font-bold">Elige a quién le das</h1>
      <p className="text-sm text-ink-muted">
        No es por orden de llegada. Sin números de celular hasta que confirmes.
      </p>

      {interestedIds.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-sm ring-1 ring-border">
          Aún no hay interesados. Comparte la publicación en WhatsApp o espera
          un poco.
        </p>
      ) : (
        <ul className="space-y-3">
          {interestedIds.map((id) => {
            const neighbor = getNeighbor(id);
            if (!neighbor) {
              return null;
            }
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    chooseRecipient(post.id, id);
                    navigate(`/feed/${post.id}/coordinar`);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-border active:bg-brand-soft"
                >
                  <Avatar
                    name={neighbor.firstName}
                    color={neighbor.avatarColor}
                  />
                  <div>
                    <p className="font-semibold">{neighbor.firstName}</p>
                    <p className="text-xs text-ink-muted">{neighbor.district}</p>
                  </div>
                  <span className="ml-auto text-sm font-medium text-brand">
                    Elegir
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
