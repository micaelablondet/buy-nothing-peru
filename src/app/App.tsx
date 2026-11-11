import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { RequireSession } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { CreatePostPage } from "@/pages/CreatePostPage";
import { EntrarPage } from "@/pages/EntrarPage";
import { FeedPage } from "@/pages/FeedPage";
import { InvitePage } from "@/pages/InvitePage";
import { LegalPrivacyPage } from "@/pages/LegalPrivacyPage";
import { LegalTermsPage } from "@/pages/LegalTermsPage";
import { MyPostsPage } from "@/pages/MyPostsPage";
import { OnboardingProfilePage } from "@/pages/OnboardingProfilePage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { PostResponsesPage } from "@/pages/PostResponsesPage";
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
              <Route index element={<FeedPage />} />
              <Route
                path="busca"
                element={
                  <PlaceholderPage
                    title={copy.shell.search}
                    body={copy.shell.emptySearch}
                  />
                }
              />
              <Route path="publica" element={<CreatePostPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="mis-publicaciones" element={<MyPostsPage />} />
              <Route path="p/:id" element={<PostDetailPage />} />
              <Route path="p/:id/respuestas" element={<PostResponsesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
