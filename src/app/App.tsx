import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { RequireSession } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { EntrarPage } from "@/pages/EntrarPage";
import { HomeShellPage } from "@/pages/HomeShellPage";
import { InvitePage } from "@/pages/InvitePage";
import { LegalPrivacyPage } from "@/pages/LegalPrivacyPage";
import { LegalTermsPage } from "@/pages/LegalTermsPage";
import { OnboardingProfilePage } from "@/pages/OnboardingProfilePage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { ProfilePage } from "@/pages/ProfilePage";

export function App() {
  return (
    <BrowserRouter>
      <div className="phone-frame">
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/entrar" element={<EntrarPage />} />
          <Route path="/invitar" element={<InvitePage />} />
          <Route path="/onboarding/perfil" element={<OnboardingProfilePage />} />
          <Route path="/legal/terminos" element={<LegalTermsPage />} />
          <Route path="/legal/privacidad" element={<LegalPrivacyPage />} />

          <Route element={<RequireSession requireProfile />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<HomeShellPage />} />
              <Route
                path="busca"
                element={
                  <PlaceholderPage
                    title={copy.shell.search}
                    body={copy.shell.emptySearch}
                  />
                }
              />
              <Route
                path="publica"
                element={
                  <PlaceholderPage
                    title={copy.shell.publish}
                    body={copy.shell.emptyPublish}
                  />
                }
              />
              <Route path="perfil" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
