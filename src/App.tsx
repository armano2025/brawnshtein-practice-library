import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { AdminGuard } from "./components/admin/AdminGuard";
import { GradePage } from "./pages/GradePage";
import { HomePage } from "./pages/HomePage";
import { MathematicsPage } from "./pages/MathematicsPage";
import { TopicPage } from "./pages/TopicPage";
import { WorksheetPage } from "./pages/WorksheetPage";
import { AdminUpload } from "./pages/admin/AdminUpload";

export function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="mathematics" element={<MathematicsPage />} />
        <Route path="grade/:id" element={<GradePage />} />
        <Route path="grade/:id/track/:trackId" element={<GradePage />} />
        <Route path="topic/:id" element={<TopicPage />} />
        <Route path="worksheet/:id" element={<WorksheetPage />} />
        <Route path="admin" element={<AdminGuard>{(user) => <AdminUpload user={user} />}</AdminGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
