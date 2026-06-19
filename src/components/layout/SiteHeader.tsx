import { Link } from "react-router-dom";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="content-container header-content">
        <Link className="brand" to="/" aria-label="עמוד הבית">
          <span className="brand-mark" aria-hidden="true">ב</span>
          <span className="brand-text">בראונשטיין</span>
        </Link>
        <span className="header-label">מאגר תרגולים</span>
      </div>
    </header>
  );
}
