import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { RequireSession } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { EntrarPage } from "@/pages/EntrarPage";
import { HomeShellPage } from "@/pages/HomeShellPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

export function App() {
  return (
    <BrowserRouter>
      <div className="phone-frame">
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/entrar" element={<EntrarPage />} />
          <Route element={<RequireSession />}>
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
              <Route
                path="perfil"
                element={
                  <PlaceholderPage
                    title={copy.shell.profile}
                    body={copy.shell.emptyProfile}
                  />
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
