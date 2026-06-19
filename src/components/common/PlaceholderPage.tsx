import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="content-container placeholder-page">
      <span className="placeholder-icon" aria-hidden="true">✦</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="secondary-link" to="/">חזרה לעמוד הראשי</Link>
    </section>
  );
}
