import { Link } from "react-router-dom";
import { copy } from "@/copy/es-PE";

export function LegalPrivacyPage() {
  return (
    <article className="legal">
      <Link to="/entrar" className="legal__back">
        ← {copy.legal.back}
      </Link>
      <h1>{copy.legal.privacyTitle}</h1>
      <p>{copy.legal.privacyIntro}</p>
      <h2>{copy.legal.privacyWhatTitle}</h2>
      <ul>
        {copy.legal.privacyWhatItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2>{copy.legal.privacyWhyTitle}</h2>
      <p>{copy.legal.privacyWhyBody}</p>
      <h2>{copy.legal.privacyDeleteTitle}</h2>
      <p>{copy.legal.privacyDeleteBody}</p>
      <p className="legal__meta">{copy.legal.meta}</p>
    </article>
  );
}
