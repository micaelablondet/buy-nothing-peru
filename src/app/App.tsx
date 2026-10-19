import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MobileLayout } from "@/app/MobileLayout";
import { RequireOnboarding } from "@/app/RequireOnboarding";
import { ChooseRecipientPage } from "@/pages/ChooseRecipientPage";
import { CoordinatePage } from "@/pages/CoordinatePage";
import { CreatePostPage } from "@/pages/CreatePostPage";
import { FeedPage } from "@/pages/FeedPage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { NeighborProfilePage } from "@/pages/NeighborProfilePage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RulesPage } from "@/pages/RulesPage";
import { SearchPage } from "@/pages/SearchPage";
import { ApoyaBarrioPage } from "@/pages/ApoyaBarrioPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "@/pages/TermsOfUsePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { SplashPage } from "@/pages/SplashPage";
import { usePrototypeStore } from "@/store/prototypeStore";

function RootEntry() {
  const onboardingComplete = usePrototypeStore((s) => s.onboardingComplete);
  const rulesAccepted = usePrototypeStore((s) => s.rulesAccepted);
  if (onboardingComplete && rulesAccepted) {
    return <Navigate to="/feed" replace />;
  }
  if (onboardingComplete && !rulesAccepted) {
    return <Navigate to="/rules" replace />;
  }
  return <SplashPage />;
}

const routerBasename =
  import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

export function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<RootEntry />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route element={<RequireOnboarding />}>
          <Route element={<MobileLayout />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/feed/:postId" element={<PostDetailPage />} />
            <Route path="/feed/:postId/elegir" element={<ChooseRecipientPage />} />
            <Route path="/feed/:postId/coordinar" element={<CoordinatePage />} />
            <Route path="/encuentra" element={<SearchPage />} />
            <Route path="/publicar" element={<CreatePostPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/vecino/:userId" element={<NeighborProfilePage />} />
            <Route path="/ajustes" element={<SettingsPage />} />
            <Route path="/ajustes/apoya" element={<ApoyaBarrioPage />} />
            <Route path="/legal/privacidad" element={<PrivacyPolicyPage />} />
            <Route path="/legal/terminos" element={<TermsOfUsePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
