import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PidoAskVisual } from "@/components/PidoAskVisual";
import { seedImageUrls } from "@/data/seedImages";
import { PROTOTYPE_POST_TYPES } from "@/lib/brand";
import { inferCategory } from "@/lib/inferCategory";
import { postTypeLabels } from "@/lib/postLabels";
import type { PostType } from "@/lib/types";
import { usePrototypeStore } from "@/store/prototypeStore";

export function CreatePostPage() {
  const navigate = useNavigate();
  const feedType = usePrototypeStore((s) => s.feedType);
  const createPost = usePrototypeStore((s) => s.createPost);
  const fileRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get("tipo") as PostType | null;

  const defaultType =
    requestedType && PROTOTYPE_POST_TYPES.includes(requestedType)
      ? requestedType
      : PROTOTYPE_POST_TYPES.includes(feedType)
        ? feedType
        : PROTOTYPE_POST_TYPES[0];
  const [type, setType] = useState<PostType>(defaultType ?? "regalo");
  const [title, setTitle] = useState(searchParams.get("titulo") ?? "");
  const [description, setDescription] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type === "pido") {
      setPreviews([]);
    }
  }, [type]);

  const onPickPhotos = (files: FileList | null) => {
    if (!files) {
      return;
    }
    const next = [...previews];
    Array.from(files)
      .slice(0, 3 - next.length)
      .forEach((file) => {
        next.push(URL.createObjectURL(file));
      });
    setPreviews(next.slice(0, 3));
  };

  const onPublish = () => {
    if (!title.trim()) {
      setError("Pon un título corto.");
      return;
    }
    if (!description.trim()) {
      setError("Agrega una descripción breve.");
      return;
    }
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    createPost({
      type,
      title: trimmedTitle,
      description: trimmedDescription,
      category: inferCategory(trimmedTitle, trimmedDescription),
      imageUrls:
        type === "pido"
          ? []
          : previews.length > 0
            ? previews
            : [...seedImageUrls.defaultPost],
    });
    navigate("/feed");
  };

  return (
    <div className="space-y-4 px-4 pb-8">
      <h1 className="pt-2 text-3xl font-bold">Publica</h1>
      <p className="text-sm text-ink-muted">
        Postea lo que tienes para regalar o lo que buscas
      </p>

      <div className="flex gap-2">
        {PROTOTYPE_POST_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
              type === t ? "bg-brand text-white" : "bg-white ring-1 ring-border"
            }`}
          >
            {postTypeLabels[t]}
          </button>
        ))}
      </div>

      {type === "regalo" ? (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onPickPhotos(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-28 w-full items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white text-sm text-ink-muted"
          >
            {previews.length > 0
              ? `${previews.length} foto(s) — tocar para agregar`
              : "Agregar fotos (opcional)"}
          </button>
          {previews.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto">
              {previews.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-border">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <PidoAskVisual variant="card" />
          </div>
          <p className="text-sm leading-snug text-ink-muted">
            Los pedidos van con un ícono de mensaje. Ingresa el título y describe
            lo que estás buscando.
          </p>
        </div>
      )}

      <label className="block">
        <span className="text-sm font-medium">Título</span>
        <input
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Bicicleta para niño"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Descripción</span>
        <textarea
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-3"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Estado, tamaño, cómo coordinarían..."
        />
      </label>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <button
        type="button"
        onClick={onPublish}
        className="w-full rounded-2xl bg-brand py-3.5 text-base font-semibold text-white"
      >
        Publicar en mi barrio
      </button>
    </div>
  );
}
