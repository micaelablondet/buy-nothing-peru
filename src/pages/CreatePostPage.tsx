import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import { createPost, fetchCategories, type PostType } from "@/lib/api";
import { maybeOfferPushAfterAction } from "@/lib/offerPush";
import { resizeImageFile } from "@/lib/resizeImage";

export function CreatePostPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [type, setType] = useState<PostType>("regalo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((list) => {
        setCategories(list);
        setCategory(list[0] ?? "");
      })
      .catch(() => setCategories([]));
  }, []);

  const onFiles = async (list: FileList | null) => {
    if (!list) {
      return;
    }
    const max = type === "regalo" ? 3 : 1;
    const next: File[] = [];
    for (const file of Array.from(list).slice(0, max)) {
      next.push(await resizeImageFile(file));
    }
    setPhotos(next);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const post = await createPost({
        type,
        title,
        description,
        category,
        photos,
      });
      void maybeOfferPushAfterAction();
      navigate(`/app/p/${post.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
      setBusy(false);
    }
  };

  if (step === "choose") {
    return (
      <section className="publish">
        <h1 className="publish__title">{copy.publish.title}</h1>
        <p className="publish__body">{copy.publish.chooseType}</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setType("regalo");
            setPhotos([]);
            setStep("form");
          }}
        >
          {copy.publish.regalo}
        </button>
        <p className="publish__hint">{copy.publish.regaloHint}</p>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setType("pido");
            setPhotos([]);
            setStep("form");
          }}
        >
          {copy.publish.pido}
        </button>
        <p className="publish__hint">{copy.publish.pidoHint}</p>
      </section>
    );
  }

  return (
    <section className="publish">
      <button
        type="button"
        className="legal__back"
        onClick={() => setStep("choose")}
      >
        ← {copy.post.back}
      </button>
      <h1 className="publish__title">
        {type === "regalo" ? copy.publish.regalo : copy.publish.pido}
      </h1>
      <form className="form-stack" onSubmit={(e) => void onSubmit(e)}>
        <label className="field">
          <span className="field__label">{copy.publish.titleLabel}</span>
          <input
            className="field__input"
            value={title}
            maxLength={60}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.publish.descriptionLabel}</span>
          <textarea
            className="field__input field__input--area"
            value={description}
            maxLength={500}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.publish.categoryLabel}</span>
          <select
            className="field__input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">{copy.publish.photosLabel}</span>
          <span className="field__hint">
            {type === "regalo"
              ? copy.publish.photosHintRegalo
              : copy.publish.photosHintPido}
          </span>
          <input
            className="field__input"
            type="file"
            accept="image/*"
            multiple={type === "regalo"}
            required={type === "regalo"}
            onChange={(e) => void onFiles(e.target.files)}
          />
          {photos.length > 0 ? (
            <span className="field__hint">
              {copy.publish.photosSelected.replace(
                "{count}",
                String(photos.length),
              )}
            </span>
          ) : null}
        </label>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? copy.publish.publishing : copy.publish.submit}
        </button>
      </form>
      {error ? <p className="entrar__error">{error}</p> : null}
    </section>
  );
}
