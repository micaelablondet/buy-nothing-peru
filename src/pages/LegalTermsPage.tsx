import { Link } from "react-router-dom";
import { copy } from "@/copy/es-PE";

export function LegalTermsPage() {
  return (
    <article className="legal">
      <Link to="/entrar" className="legal__back">
        ← {copy.legal.back}
      </Link>
      <h1>{copy.legal.termsTitle}</h1>
      <p>{copy.legal.termsIntro}</p>
      <h2>{copy.legal.termsUseTitle}</h2>
      <ul>
        {copy.legal.termsUseItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2>{copy.legal.termsAccountsTitle}</h2>
      <p>{copy.legal.termsAccountsBody}</p>
      <p className="legal__meta">{copy.legal.meta}</p>
    </article>
  );
}
