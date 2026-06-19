import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "../navigation/Breadcrumbs";
import { SiteHeader } from "./SiteHeader";

export function SiteLayout() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="main-content">
        <Breadcrumbs />
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="content-container">מאגר תרגילי בראונשטיין</div>
      </footer>
    </div>
  );
}
