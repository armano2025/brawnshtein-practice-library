import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { GradePage } from "./pages/GradePage";
import { HomePage } from "./pages/HomePage";
import { MathematicsPage } from "./pages/MathematicsPage";
import { TopicPage } from "./pages/TopicPage";
import { WorksheetPage } from "./pages/WorksheetPage";

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
