import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { RequireSession } from "@/app/RequireSession";
import { CreatePostPage } from "@/pages/CreatePostPage";
import { EntrarPage } from "@/pages/EntrarPage";
import { FeedPage } from "@/pages/FeedPage";
import { InvitePage } from "@/pages/InvitePage";
import { LegalPrivacyPage } from "@/pages/LegalPrivacyPage";
import { LegalTermsPage } from "@/pages/LegalTermsPage";
import { MyPostsPage } from "@/pages/MyPostsPage";
import { OnboardingProfilePage } from "@/pages/OnboardingProfilePage";
import { HandoffPage } from "@/pages/HandoffPage";
import { InboxPage } from "@/pages/InboxPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { PostResponsesPage } from "@/pages/PostResponsesPage";
import { AdminPage } from "@/pages/AdminPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SearchPage } from "@/pages/SearchPage";

function PhoneShell() {
  return (
    <div className="phone-frame">
      <Outlet />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<EntrarPage />} />

        <Route element={<PhoneShell />}>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/invitar" element={<InvitePage />} />
          <Route path="/onboarding/perfil" element={<OnboardingProfilePage />} />
          <Route path="/legal/terminos" element={<LegalTermsPage />} />
          <Route path="/legal/privacidad" element={<LegalPrivacyPage />} />

          <Route element={<RequireSession requireProfile />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/app" element={<AppShell />}>
              <Route index element={<FeedPage />} />
              <Route path="busca" element={<SearchPage />} />
              <Route path="publica" element={<CreatePostPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="inbox" element={<InboxPage />} />
              <Route path="mis-publicaciones" element={<MyPostsPage />} />
              <Route path="p/:id" element={<PostDetailPage />} />
              <Route path="p/:id/respuestas" element={<PostResponsesPage />} />
              <Route path="p/:id/recojo" element={<HandoffPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
