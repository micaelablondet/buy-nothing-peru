import { useState, type FormEvent } from "react";
import { copy } from "@/copy/es-PE";
import { createResponse, type PostType } from "@/lib/api";
import { maybeOfferPushAfterAction } from "@/lib/offerPush";
import { resizeImageFile } from "@/lib/resizeImage";

type Props = {
  postId: string;
  postType: PostType;
  displayName: string;
  districtName: string;
  onClose: () => void;
  onDone: () => void;
};

export function ResponseSheet({
  postId,
  postType,
  displayName,
  districtName,
  onClose,
  onDone,
}: Props) {
  const [note, setNote] = useState(
    postType === "pido" ? copy.respond.pidoDefault : "",
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await createResponse({ postId, note, photo });
      void maybeOfferPushAfterAction();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
      setBusy(false);
    }
  };

  return (
    <div className="sheet" role="dialog" aria-modal="true">
      <div className="sheet__backdrop" onClick={onClose} />
      <div className="sheet__panel">
        <div className="sheet__header">
          <h2 className="sheet__title">
            {postType === "regalo"
              ? copy.respond.titleRegalo
              : copy.respond.titlePido}
          </h2>
          <button type="button" className="sheet__close" onClick={onClose}>
            {copy.respond.close}
          </button>
        </div>
        <p className="sheet__preview">
          {copy.respond.previewAs
            .replace("{name}", displayName)
            .replace("{district}", districtName)}
        </p>
        <form className="form-stack" onSubmit={(e) => void onSubmit(e)}>
          <label className="field">
            <span className="field__label">{copy.respond.note}</span>
            <textarea
              className="field__input field__input--area"
              value={note}
              maxLength={140}
              rows={3}
              onChange={(e) => setNote(e.target.value)}
            />
            <span className="field__hint">{copy.respond.noteHint}</span>
          </label>
          {postType === "pido" ? (
            <label className="field">
              <span className="field__label">{copy.respond.addPhoto}</span>
              <input
                className="field__input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setPhoto(null);
                    return;
                  }
                  void resizeImageFile(file).then(setPhoto);
                }}
              />
            </label>
          ) : null}
          <button type="submit" className="btn-primary" disabled={busy}>
            {copy.respond.confirm}
          </button>
        </form>
        {error ? <p className="entrar__error">{error}</p> : null}
      </div>
    </div>
  );
}
