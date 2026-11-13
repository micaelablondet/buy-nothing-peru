import { useEffect, useState, type FormEvent } from "react";
import { copy } from "@/copy/es-PE";
import { fetchReportReasons, submitReport } from "@/lib/api";

/** SAFE-01 */
export function ReportButton({
  postId,
  responseId,
}: {
  postId: string;
  responseId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    fetchReportReasons()
      .then((list) => {
        setReasons(list);
        setReason(list[0] ?? "");
      })
      .catch(() => setReasons([]));
  }, [open]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await submitReport({
        postId,
        responseId,
        reason,
        text: text.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        className="btn-text"
        onClick={() => {
          setOpen(true);
          setDone(false);
          setText("");
          setError(null);
        }}
      >
        {copy.report.label}
      </button>
    );
  }

  return (
    <div className="report-sheet" role="dialog" aria-label={copy.report.title}>
      {done ? (
        <>
          <p>{copy.report.thanks}</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setOpen(false)}
          >
            {copy.report.close}
          </button>
        </>
      ) : (
        <form className="form-stack" onSubmit={(e) => void onSubmit(e)}>
          <h2 className="publish__title">{copy.report.title}</h2>
          <label className="field">
            <span className="field__label">{copy.report.reasonLabel}</span>
            <select
              className="field__input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              {reasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">{copy.report.textLabel}</span>
            <textarea
              className="field__input field__input--area"
              value={text}
              maxLength={500}
              rows={3}
              onChange={(e) => setText(e.target.value)}
            />
          </label>
          <button type="submit" className="btn-primary" disabled={busy}>
            {copy.report.submit}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setOpen(false)}
          >
            {copy.report.close}
          </button>
          {error ? <p className="entrar__error">{error}</p> : null}
        </form>
      )}
    </div>
  );
}
